const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { Order, Cart, Restaurant } = require('../models');

/**
 * @desc    Create order
 * @route   POST /api/orders
 * @access  Private (Customer)
 */
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { items, deliveryAddress, payment, specialInstructions } = req.body;

  // Create order
  const order = await Order.create({
    customer: req.user.id,
    restaurant: items[0].restaurant, // Primary restaurant
    items,
    deliveryAddress,
    customerPhone: req.user.phone,
    payment,
    pricing: req.body.pricing,
    specialInstructions,
    estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000) // 45 mins
  });

  // Clear cart after order
  const cart = await Cart.findOne({ customer: req.user.id });
  if (cart) {
    await cart.clearCart();
  }

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order
  });
});

/**
 * @desc    Get all orders (with filters)
 * @route   GET /api/orders
 * @access  Private
 */
exports.getOrders = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;

  let query = {};

  // Role-based filtering
  if (req.user.role === 'customer') {
    query.customer = req.user.id;
  } else if (req.user.role === 'vendor') {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (restaurant) {
      query.restaurant = restaurant._id;
    }
  } else if (req.user.role === 'delivery') {
    query.deliveryPartner = req.user.id;
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('customer', 'name phone')
    .populate('restaurant', 'name logo phone')
    .populate('deliveryPartner', 'name phone')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Order.countDocuments(query);

  res.status(200).json({
    success: true,
    count: orders.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: orders
  });
});

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email phone')
    .populate('restaurant', 'name logo phone address')
    .populate('deliveryPartner', 'name phone')
    .populate('items.menuItem', 'name image');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Check authorization
  if (
    req.user.role === 'customer' && order.customer._id.toString() !== req.user.id &&
    req.user.role === 'delivery' && order.deliveryPartner?._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('Not authorized to view this order', 403));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (Vendor/Delivery/Admin)
 */
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Update status
  order.status = status;
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated',
    data: order
  });
});

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private (Customer/Admin)
 */
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Check if can be cancelled
  if (!order.canBeCancelled()) {
    return next(new ErrorResponse('Order cannot be cancelled at this stage', 400));
  }

  // Check authorization
  if (req.user.role === 'customer' && order.customer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to cancel this order', 403));
  }

  order.status = 'cancelled';
  order.cancellationReason = reason;
  order.cancelledBy = req.user.role;
  order.cancelledAt = new Date();
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order
  });
});

/**
 * @desc    Get order statistics
 * @route   GET /api/orders/stats
 * @access  Private (Vendor/Admin)
 */
exports.getOrderStats = asyncHandler(async (req, res, next) => {
  let matchQuery = {};

  if (req.user.role === 'vendor') {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (restaurant) {
      matchQuery.restaurant = restaurant._id;
    }
  }

  const stats = await Order.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.totalAmount' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});
