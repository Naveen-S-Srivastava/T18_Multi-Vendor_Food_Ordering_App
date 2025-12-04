const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');
const { createMenuItemRules, objectIdRule, validate } = require('../middleware/validator');

// Category routes
router.get('/:restaurantId/categories', menuController.getCategories);
router.post('/:restaurantId/categories', protect, authorize('vendor'), menuController.createCategory);
router.put('/categories/:id', protect, authorize('vendor'), objectIdRule, validate, menuController.updateCategory);
router.delete('/categories/:id', protect, authorize('vendor'), objectIdRule, validate, menuController.deleteCategory);

// Menu item routes
router.get('/:restaurantId/items', menuController.getMenuItems);
router.get('/items/:id', objectIdRule, validate, menuController.getMenuItem);
router.post('/:restaurantId/items', protect, authorize('vendor'), createMenuItemRules, validate, menuController.createMenuItem);
router.put('/items/:id', protect, authorize('vendor'), objectIdRule, validate, menuController.updateMenuItem);
router.delete('/items/:id', protect, authorize('vendor'), objectIdRule, validate, menuController.deleteMenuItem);
router.put('/items/:id/toggle-availability', protect, authorize('vendor'), objectIdRule, validate, menuController.toggleItemAvailability);

module.exports = router;
