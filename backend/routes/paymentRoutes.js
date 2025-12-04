const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { objectIdRule, validate } = require('../middleware/validator');

// Protected routes
router.post('/', protect, paymentController.createPayment);
router.get('/', protect, paymentController.getPayments);
router.get('/:id', protect, objectIdRule, validate, paymentController.getPayment);

// Admin routes
router.post('/:id/refund', protect, authorize('admin'), objectIdRule, validate, paymentController.processRefund);

// Webhook route (public)
router.put('/:id/status', objectIdRule, validate, paymentController.updatePaymentStatus);

module.exports = router;
