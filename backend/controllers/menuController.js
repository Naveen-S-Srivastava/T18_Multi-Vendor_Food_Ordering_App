const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { Category, MenuItem, Restaurant } = require('../models');

/**
 * @desc    Get categories for a restaurant
 * @route   GET /api/menu/:restaurantId/categories
 * @access  Public
 */
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({
    restaurant: req.params.restaurantId,
    isActive: true
  }).sort({ displayOrder: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

/**
 * @desc    Create category
 * @route   POST /api/menu/:restaurantId/categories
 * @access  Private (Vendor)
 */
exports.createCategory = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);

  if (!restaurant) {
    return next(new ErrorResponse('Restaurant not found', 404));
  }

  // Check ownership
  if (restaurant.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  req.body.restaurant = req.params.restaurantId;
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category
  });
});

/**
 * @desc    Update category
 * @route   PUT /api/menu/categories/:id
 * @access  Private (Vendor)
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id).populate('restaurant');

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  // Check ownership
  if (category.restaurant.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category
  });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/menu/categories/:id
 * @access  Private (Vendor)
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate('restaurant');

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }

  // Check ownership
  if (category.restaurant.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  await category.remove();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
    data: {}
  });
});

/**
 * @desc    Get menu items for a restaurant
 * @route   GET /api/menu/:restaurantId/items
 * @access  Public
 */
exports.getMenuItems = asyncHandler(async (req, res, next) => {
  const { category, foodType, search } = req.query;

  const query = {
    restaurant: req.params.restaurantId,
    isAvailable: true
  };

  if (category) {
    query.category = category;
  }

  if (foodType) {
    query.foodType = foodType;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const items = await MenuItem.find(query)
    .populate('category', 'name')
    .sort({ displayOrder: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

/**
 * @desc    Get single menu item
 * @route   GET /api/menu/items/:id
 * @access  Public
 */
exports.getMenuItem = asyncHandler(async (req, res, next) => {
  const item = await MenuItem.findById(req.params.id)
    .populate('category', 'name')
    .populate('restaurant', 'name logo');

  if (!item) {
    return next(new ErrorResponse('Menu item not found', 404));
  }

  res.status(200).json({
    success: true,
    data: item
  });
});

/**
 * @desc    Create menu item
 * @route   POST /api/menu/:restaurantId/items
 * @access  Private (Vendor)
 */
exports.createMenuItem = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);

  if (!restaurant) {
    return next(new ErrorResponse('Restaurant not found', 404));
  }

  // Check ownership
  if (restaurant.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  req.body.restaurant = req.params.restaurantId;
  const item = await MenuItem.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Menu item created successfully',
    data: item
  });
});

/**
 * @desc    Update menu item
 * @route   PUT /api/menu/items/:id
 * @access  Private (Vendor)
 */
exports.updateMenuItem = asyncHandler(async (req, res, next) => {
  let item = await MenuItem.findById(req.params.id).populate('restaurant');

  if (!item) {
    return next(new ErrorResponse('Menu item not found', 404));
  }

  // Check ownership
  if (item.restaurant.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Menu item updated successfully',
    data: item
  });
});

/**
 * @desc    Delete menu item
 * @route   DELETE /api/menu/items/:id
 * @access  Private (Vendor)
 */
exports.deleteMenuItem = asyncHandler(async (req, res, next) => {
  const item = await MenuItem.findById(req.params.id).populate('restaurant');

  if (!item) {
    return next(new ErrorResponse('Menu item not found', 404));
  }

  // Check ownership
  if (item.restaurant.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  await item.remove();

  res.status(200).json({
    success: true,
    message: 'Menu item deleted successfully',
    data: {}
  });
});

/**
 * @desc    Toggle menu item availability
 * @route   PUT /api/menu/items/:id/toggle-availability
 * @access  Private (Vendor)
 */
exports.toggleItemAvailability = asyncHandler(async (req, res, next) => {
  const item = await MenuItem.findById(req.params.id).populate('restaurant');

  if (!item) {
    return next(new ErrorResponse('Menu item not found', 404));
  }

  // Check ownership
  if (item.restaurant.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  item.isAvailable = !item.isAvailable;
  await item.save();

  res.status(200).json({
    success: true,
    message: `Item ${item.isAvailable ? 'made available' : 'made unavailable'}`,
    data: item
  });
});
