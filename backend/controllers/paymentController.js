const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { Payment, Order } = require('../models');

/**
 * @desc    Create payment
 * @route   POST /api/payments
 * @access  Private
 */
exports.createPayment = asyncHandler(async (req, res, next) => {
  const { order, paymentMethod, paymentGateway, amount } = req.body;

  // Check if order exists
  const orderDoc = await Order.findById(order);

  if (!orderDoc) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Check ownership
  if (orderDoc.customer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  // Create payment
  const payment = await Payment.create({
    order,
    customer: req.user.id,
    paymentMethod,
    paymentGateway,
    amount: {
      total: amount || orderDoc.pricing.grandTotal,
      currency: 'INR'
    },
    status: 'pending'
  });

  // TODO: Integrate with payment gateway
  // For now, we'll mark as success for COD
  if (paymentMethod === 'cash') {
    payment.status = 'success';
    await payment.save();
  }

  res.status(201).json({
    success: true,
    message: 'Payment initiated',
    data: payment
  });
});

/**
 * @desc    Update payment status (webhook)
 * @route   PUT /api/payments/:id/status
 * @access  Public (webhook)
 */
exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const { status, transactionId, gatewayResponse } = req.body;

  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(new ErrorResponse('Payment not found', 404));
  }

  payment.status = status;
  payment.transactionId = transactionId;
  payment.gatewayResponse = gatewayResponse;

  if (status === 'success') {
    payment.completedAt = new Date();
    
    // Update order payment status
    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: 'paid',
      'payment.transactionId': transactionId
    });
  }

  await payment.save();

  res.status(200).json({
    success: true,
    message: 'Payment status updated',
    data: payment
  });
});

/**
 * @desc    Get payment details
 * @route   GET /api/payments/:id
 * @access  Private
 */
exports.getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)
    .populate('order', 'orderNumber pricing')
    .populate('customer', 'name email');

  if (!payment) {
    return next(new ErrorResponse('Payment not found', 404));
  }

  // Check authorization
  if (
    payment.customer.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

/**
 * @desc    Get user payments
 * @route   GET /api/payments
 * @access  Private
 */
exports.getPayments = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = {};

  if (req.user.role === 'customer') {
    query.customer = req.user.id;
  }

  if (status) {
    query.status = status;
  }

  const payments = await Payment.find(query)
    .populate('order', 'orderNumber pricing')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Payment.countDocuments(query);

  res.status(200).json({
    success: true,
    count: payments.length,
    total: count,
    data: payments
  });
});

/**
 * @desc    Process refund
 * @route   POST /api/payments/:id/refund
 * @access  Private (Admin)
 */
exports.processRefund = asyncHandler(async (req, res, next) => {
  const { amount, reason } = req.body;

  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(new ErrorResponse('Payment not found', 404));
  }

  if (payment.status !== 'success') {
    return next(new ErrorResponse('Can only refund successful payments', 400));
  }

  // Process refund
  payment.processRefund(amount, reason, req.user.id);
  await payment.save();

  // Update order status
  await Order.findByIdAndUpdate(payment.order, { status: 'refunded' });

  res.status(200).json({
    success: true,
    message: 'Refund processed successfully',
    data: payment
  });
});
