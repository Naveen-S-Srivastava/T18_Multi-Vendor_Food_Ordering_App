const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { Review, Order, Restaurant, MenuItem } = require('../models');

/**
 * @desc    Create review
 * @route   POST /api/reviews
 * @access  Private (Customer)
 */
exports.createReview = asyncHandler(async (req, res, next) => {
  const { reviewType, order, restaurant, menuItem, deliveryPartner, rating, comment, detailedRatings, images } = req.body;

  // Check if order exists and belongs to user
  const orderDoc = await Order.findById(order);

  if (!orderDoc) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (orderDoc.customer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to review this order', 403));
  }

  if (orderDoc.status !== 'delivered') {
    return next(new ErrorResponse('Can only review delivered orders', 400));
  }

  // Check if already reviewed
  const existingReview = await Review.findOne({
    customer: req.user.id,
    order,
    reviewType,
    ...(restaurant && { restaurant }),
    ...(menuItem && { menuItem }),
    ...(deliveryPartner && { deliveryPartner })
  });

  if (existingReview) {
    return next(new ErrorResponse('You have already reviewed this', 400));
  }

  // Create review
  const review = await Review.create({
    reviewType,
    customer: req.user.id,
    order,
    restaurant,
    menuItem,
    deliveryPartner,
    rating,
    comment,
    detailedRatings,
    images
  });

  // Update ratings
  if (reviewType === 'restaurant' && restaurant) {
    const stats = await Review.getRestaurantAverageRating(restaurant);
    await Restaurant.findByIdAndUpdate(restaurant, {
      'rating.average': stats.averageRating,
      'rating.count': stats.count
    });
  } else if (reviewType === 'menuItem' && menuItem) {
    const stats = await Review.getMenuItemAverageRating(menuItem);
    await MenuItem.findByIdAndUpdate(menuItem, {
      'rating.average': stats.averageRating,
      'rating.count': stats.count
    });
  }

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: review
  });
});

/**
 * @desc    Get reviews
 * @route   GET /api/reviews
 * @access  Public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  const { reviewType, restaurant, menuItem, deliveryPartner, page = 1, limit = 10 } = req.query;

  const query = { isVisible: true };

  if (reviewType) query.reviewType = reviewType;
  if (restaurant) query.restaurant = restaurant;
  if (menuItem) query.menuItem = menuItem;
  if (deliveryPartner) query.deliveryPartner = deliveryPartner;

  const reviews = await Review.find(query)
    .populate('customer', 'name avatar')
    .populate('restaurant', 'name logo')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Review.countDocuments(query);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total: count,
    data: reviews
  });
});

/**
 * @desc    Get single review
 * @route   GET /api/reviews/:id
 * @access  Public
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate('customer', 'name avatar')
    .populate('restaurant', 'name logo')
    .populate('menuItem', 'name image');

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

/**
 * @desc    Add vendor response to review
 * @route   POST /api/reviews/:id/response
 * @access  Private (Vendor)
 */
exports.addResponse = asyncHandler(async (req, res, next) => {
  const { text } = req.body;

  const review = await Review.findById(req.params.id).populate('restaurant');

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  // Check if user owns the restaurant
  if (review.restaurant.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  review.addResponse(text, req.user.id);
  await review.save();

  res.status(200).json({
    success: true,
    message: 'Response added successfully',
    data: review
  });
});

/**
 * @desc    Mark review as helpful
 * @route   PUT /api/reviews/:id/helpful
 * @access  Private
 */
exports.markAsHelpful = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Review not found', 404));
  }

  review.markAsHelpful(req.user.id);
  await review.save();

  res.status(200).json({
    success: true,
    message: 'Marked as helpful',
    data: review
  });
});
