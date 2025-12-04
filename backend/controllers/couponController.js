const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { Coupon } = require('../models');

/**
 * @desc    Validate coupon
 * @route   POST /api/coupons/validate
 * @access  Private
 */
exports.validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, orderAmount } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    return next(new ErrorResponse('Invalid coupon code', 404));
  }

  // Check validity
  const validity = coupon.canBeUsedBy(req.user.id, orderAmount);

  if (!validity.valid) {
    return next(new ErrorResponse(validity.reason, 400));
  }

  // Calculate discount
  const discountAmount = coupon.calculateDiscount(orderAmount);

  res.status(200).json({
    success: true,
    message: 'Coupon is valid',
    data: {
      code: coupon.code,
      title: coupon.title,
      discountType: coupon.discountType,
      discountAmount,
      finalAmount: orderAmount - discountAmount
    }
  });
});

/**
 * @desc    Get all coupons
 * @route   GET /api/coupons
 * @access  Public
 */
exports.getCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find({
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() }
  }).select('-usedBy -applicableUsers');

  res.status(200).json({
    success: true,
    count: coupons.length,
    data: coupons
  });
});

/**
 * @desc    Create coupon
 * @route   POST /api/coupons
 * @access  Private (Admin)
 */
exports.createCoupon = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const coupon = await Coupon.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Coupon created successfully',
    data: coupon
  });
});

/**
 * @desc    Update coupon
 * @route   PUT /api/coupons/:id
 * @access  Private (Admin)
 */
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Coupon updated successfully',
    data: coupon
  });
});

/**
 * @desc    Delete coupon
 * @route   DELETE /api/coupons/:id
 * @access  Private (Admin)
 */
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }

  await coupon.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Coupon deleted successfully',
    data: {}
  });
});
