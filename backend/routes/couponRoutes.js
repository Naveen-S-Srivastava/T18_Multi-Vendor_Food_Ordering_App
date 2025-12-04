const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');
const { objectIdRule, validate } = require('../middleware/validator');

// Public routes
router.get('/', couponController.getCoupons);

// Protected routes
router.post('/validate', protect, couponController.validateCoupon);

// Admin routes
router.post('/', protect, authorize('admin'), couponController.createCoupon);
router.put('/:id', protect, authorize('admin'), objectIdRule, validate, couponController.updateCoupon);
router.delete('/:id', protect, authorize('admin'), objectIdRule, validate, couponController.deleteCoupon);

module.exports = router;
