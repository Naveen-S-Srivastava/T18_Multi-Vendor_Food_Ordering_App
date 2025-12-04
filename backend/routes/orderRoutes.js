const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { createOrderRules, objectIdRule, validate } = require('../middleware/validator');

// All routes require authentication
router.use(protect);

// Customer routes
router.post('/', authorize('customer'), createOrderRules, validate, orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/stats', authorize('vendor', 'admin'), orderController.getOrderStats);
router.get('/:id', objectIdRule, validate, orderController.getOrder);

// Status updates
router.put('/:id/status', authorize('vendor', 'delivery', 'admin'), objectIdRule, validate, orderController.updateOrderStatus);
router.put('/:id/cancel', authorize('customer', 'admin'), objectIdRule, validate, orderController.cancelOrder);

module.exports = router;
