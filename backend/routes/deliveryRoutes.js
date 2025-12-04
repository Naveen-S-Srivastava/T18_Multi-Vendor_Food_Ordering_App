const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/auth');
const { objectIdRule, validate } = require('../middleware/validator');

// All routes require authentication
router.use(protect);

// Delivery partner routes
router.get('/', authorize('delivery', 'admin'), deliveryController.getDeliveries);
router.get('/available', authorize('delivery'), deliveryController.getAvailableDeliveries);
router.get('/:id', objectIdRule, validate, deliveryController.getDelivery);
router.put('/:id/accept', authorize('delivery'), objectIdRule, validate, deliveryController.acceptDelivery);
router.put('/:id/location', authorize('delivery'), objectIdRule, validate, deliveryController.updateLocation);
router.put('/:id/status', authorize('delivery'), objectIdRule, validate, deliveryController.updateDeliveryStatus);
router.put('/:id/deliver', authorize('delivery'), objectIdRule, validate, deliveryController.markAsDelivered);

module.exports = router;
