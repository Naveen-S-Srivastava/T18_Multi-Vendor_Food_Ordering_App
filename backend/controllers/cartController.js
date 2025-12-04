const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { Cart, MenuItem } = require('../models');

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ customer: req.user.id })
    .populate('restaurants.restaurant', 'name logo deliverySettings')
    .populate('restaurants.items.menuItem', 'name image price');

  if (!cart) {
    cart = await Cart.create({ customer: req.user.id });
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private
 */
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { restaurantId, menuItem, quantity, selectedVariants, selectedAddOns, instructions } = req.body;

  // Get menu item details
  const item = await MenuItem.findById(menuItem).populate('restaurant');

  if (!item) {
    return next(new ErrorResponse('Menu item not found', 404));
  }

  if (!item.isAvailable) {
    return next(new ErrorResponse('Item is not available', 400));
  }

  // Get or create cart
  let cart = await Cart.findOne({ customer: req.user.id });

  if (!cart) {
    cart = await Cart.create({ customer: req.user.id });
  }

  // Prepare item data
  const itemData = {
    menuItem: item._id,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: quantity || 1,
    selectedVariants: selectedVariants || [],
    selectedAddOns: selectedAddOns || [],
    instructions: instructions || ''
  };

  // Add item to cart
  await cart.addItem(restaurantId, itemData);

  cart = await Cart.findById(cart._id)
    .populate('restaurants.restaurant', 'name logo deliverySettings')
    .populate('restaurants.items.menuItem', 'name image price');

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: cart
  });
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/items/:itemId
 * @access  Private
 */
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity, restaurantId } = req.body;

  const cart = await Cart.findOne({ customer: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  await cart.updateItemQuantity(restaurantId, req.params.itemId, quantity);

  const updatedCart = await Cart.findById(cart._id)
    .populate('restaurants.restaurant', 'name logo deliverySettings')
    .populate('restaurants.items.menuItem', 'name image price');

  res.status(200).json({
    success: true,
    message: 'Cart updated',
    data: updatedCart
  });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:itemId
 * @access  Private
 */
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.body;

  const cart = await Cart.findOne({ customer: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  await cart.removeItem(restaurantId, req.params.itemId);

  const updatedCart = await Cart.findById(cart._id)
    .populate('restaurants.restaurant', 'name logo deliverySettings')
    .populate('restaurants.items.menuItem', 'name image price');

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: updatedCart
  });
});

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ customer: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  await cart.clearCart();

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
    data: cart
  });
});

/**
 * @desc    Apply coupon to cart
 * @route   POST /api/cart/apply-coupon
 * @access  Private
 */
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const { code } = req.body;

  const cart = await Cart.findOne({ customer: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  // Coupon validation logic would go here
  // For now, just update the cart
  cart.appliedCoupon = { code };
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Coupon applied',
    data: cart
  });
});
