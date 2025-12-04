const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { Restaurant } = require('../models');

/**
 * @desc    Get all restaurants
 * @route   GET /api/restaurants
 * @access  Public
 */
exports.getRestaurants = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, search, cuisine, priceRange, rating, isOpen } = req.query;

  const query = { isActive: true, isVerified: true };

  // Search by name
  if (search) {
    query.$text = { $search: search };
  }

  // Filter by cuisine
  if (cuisine) {
    query.cuisineTypes = { $in: cuisine.split(',') };
  }

  // Filter by price range
  if (priceRange) {
    query.priceRange = { $in: priceRange.split(',') };
  }

  // Filter by rating
  if (rating) {
    query['rating.average'] = { $gte: parseFloat(rating) };
  }

  // Filter by open status
  if (isOpen === 'true') {
    query.isOpen = true;
  }

  const restaurants = await Restaurant.find(query)
    .select('-verificationDocuments')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ 'rating.average': -1 });

  const count = await Restaurant.countDocuments(query);

  res.status(200).json({
    success: true,
    count: restaurants.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: restaurants
  });
});

/**
 * @desc    Get nearby restaurants
 * @route   GET /api/restaurants/nearby
 * @access  Public
 */
exports.getNearbyRestaurants = asyncHandler(async (req, res, next) => {
  const { lng, lat, maxDistance = 10000 } = req.query;

  if (!lng || !lat) {
    return next(new ErrorResponse('Please provide longitude and latitude', 400));
  }

  const restaurants = await Restaurant.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: parseInt(maxDistance)
      }
    },
    isActive: true,
    isVerified: true
  }).select('-verificationDocuments');

  res.status(200).json({
    success: true,
    count: restaurants.length,
    data: restaurants
  });
});

/**
 * @desc    Get single restaurant
 * @route   GET /api/restaurants/:id
 * @access  Public
 */
exports.getRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id)
    .populate('owner', 'name email phone')
    .select('-verificationDocuments');

  if (!restaurant) {
    return next(new ErrorResponse('Restaurant not found', 404));
  }

  res.status(200).json({
    success: true,
    data: restaurant
  });
});

/**
 * @desc    Create restaurant
 * @route   POST /api/restaurants
 * @access  Private (Vendor)
 */
exports.createRestaurant = asyncHandler(async (req, res, next) => {
  // Add owner to req.body
  req.body.owner = req.user.id;

  // Check if user already has a restaurant
  const existingRestaurant = await Restaurant.findOne({ owner: req.user.id });

  if (existingRestaurant) {
    return next(new ErrorResponse('You already have a restaurant', 400));
  }

  const restaurant = await Restaurant.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Restaurant created successfully',
    data: restaurant
  });
});

/**
 * @desc    Update restaurant
 * @route   PUT /api/restaurants/:id
 * @access  Private (Vendor/Admin)
 */
exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  let restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(new ErrorResponse('Restaurant not found', 404));
  }

  // Make sure user is restaurant owner or admin
  if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this restaurant', 403));
  }

  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Restaurant updated successfully',
    data: restaurant
  });
});

/**
 * @desc    Delete restaurant
 * @route   DELETE /api/restaurants/:id
 * @access  Private (Admin)
 */
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(new ErrorResponse('Restaurant not found', 404));
  }

  await restaurant.remove();

  res.status(200).json({
    success: true,
    message: 'Restaurant deleted successfully',
    data: {}
  });
});

/**
 * @desc    Get vendor's restaurant
 * @route   GET /api/restaurants/my-restaurant
 * @access  Private (Vendor)
 */
exports.getMyRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findOne({ owner: req.user.id });

  if (!restaurant) {
    return next(new ErrorResponse('No restaurant found', 404));
  }

  res.status(200).json({
    success: true,
    data: restaurant
  });
});

/**
 * @desc    Toggle restaurant open status
 * @route   PUT /api/restaurants/:id/toggle-status
 * @access  Private (Vendor)
 */
exports.toggleRestaurantStatus = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(new ErrorResponse('Restaurant not found', 404));
  }

  // Make sure user is restaurant owner
  if (restaurant.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  restaurant.isOpen = !restaurant.isOpen;
  await restaurant.save();

  res.status(200).json({
    success: true,
    message: `Restaurant ${restaurant.isOpen ? 'opened' : 'closed'} successfully`,
    data: restaurant
  });
});
