const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { Delivery, Order, User } = require('../models');

/**
 * @desc    Get all deliveries
 * @route   GET /api/deliveries
 * @access  Private (Delivery/Admin)
 */
exports.getDeliveries = asyncHandler(async (req, res, next) => {
  const { status, page = 1, limit = 10 } = req.query;

  let query = {};

  // Filter by delivery partner
  if (req.user.role === 'delivery') {
    query.deliveryPartner = req.user.id;
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  const deliveries = await Delivery.find(query)
    .populate('order', 'orderNumber pricing')
    .populate('deliveryPartner', 'name phone')
    .populate('pickupLocation.restaurant', 'name address phone')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Delivery.countDocuments(query);

  res.status(200).json({
    success: true,
    count: deliveries.length,
    total: count,
    data: deliveries
  });
});

/**
 * @desc    Get single delivery
 * @route   GET /api/deliveries/:id
 * @access  Private
 */
exports.getDelivery = asyncHandler(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.id)
    .populate('order')
    .populate('deliveryPartner', 'name phone')
    .populate('pickupLocation.restaurant', 'name address phone');

  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  res.status(200).json({
    success: true,
    data: delivery
  });
});

/**
 * @desc    Accept delivery
 * @route   PUT /api/deliveries/:id/accept
 * @access  Private (Delivery)
 */
exports.acceptDelivery = asyncHandler(async (req, res, next) => {
  const delivery = await Delivery.findById(req.params.id);

  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  if (!delivery.canBeAccepted()) {
    return next(new ErrorResponse('Delivery cannot be accepted', 400));
  }

  delivery.assignmentStatus = 'accepted';
  delivery.acceptedAt = new Date();
  await delivery.save();

  res.status(200).json({
    success: true,
    message: 'Delivery accepted',
    data: delivery
  });
});

/**
 * @desc    Update delivery location
 * @route   PUT /api/deliveries/:id/location
 * @access  Private (Delivery)
 */
exports.updateLocation = asyncHandler(async (req, res, next) => {
  const { latitude, longitude, speed, accuracy } = req.body;

  const delivery = await Delivery.findById(req.params.id);

  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  // Check authorization
  if (delivery.deliveryPartner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  delivery.updateLocation(latitude, longitude, speed, accuracy);
  await delivery.save();

  // Emit socket event for real-time tracking
  req.app.get('io').to(`order_${delivery.order}`).emit('delivery_location', {
    orderId: delivery.order,
    location: { latitude, longitude }
  });

  res.status(200).json({
    success: true,
    message: 'Location updated',
    data: delivery.currentLocation
  });
});

/**
 * @desc    Update delivery status
 * @route   PUT /api/deliveries/:id/status
 * @access  Private (Delivery)
 */
exports.updateDeliveryStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const delivery = await Delivery.findById(req.params.id);

  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  // Check authorization
  if (delivery.deliveryPartner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  delivery.status = status;
  await delivery.save();

  res.status(200).json({
    success: true,
    message: 'Delivery status updated',
    data: delivery
  });
});

/**
 * @desc    Mark delivery as delivered
 * @route   PUT /api/deliveries/:id/deliver
 * @access  Private (Delivery)
 */
exports.markAsDelivered = asyncHandler(async (req, res, next) => {
  const { photo, signature, otp, notes } = req.body;

  const delivery = await Delivery.findById(req.params.id);

  if (!delivery) {
    return next(new ErrorResponse('Delivery not found', 404));
  }

  // Check authorization
  if (delivery.deliveryPartner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  delivery.markAsDelivered({ photo, signature, otp, notes });
  await delivery.save();

  // Update order status
  await Order.findByIdAndUpdate(delivery.order, { status: 'delivered', deliveredAt: new Date() });

  res.status(200).json({
    success: true,
    message: 'Delivery marked as delivered',
    data: delivery
  });
});

/**
 * @desc    Get available deliveries for assignment
 * @route   GET /api/deliveries/available
 * @access  Private (Delivery)
 */
exports.getAvailableDeliveries = asyncHandler(async (req, res, next) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return next(new ErrorResponse('Please provide your location', 400));
  }

  const deliveries = await Delivery.find({
    assignmentStatus: 'pending',
    status: 'pending',
    'pickupLocation.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: 5000 // 5km
      }
    }
  })
    .populate('order', 'orderNumber pricing')
    .populate('pickupLocation.restaurant', 'name address')
    .limit(10);

  res.status(200).json({
    success: true,
    count: deliveries.length,
    data: deliveries
  });
});
