const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/auth');
const { createRestaurantRules, objectIdRule, validate } = require('../middleware/validator');

// Public routes
router.get('/', restaurantController.getRestaurants);
router.get('/nearby', restaurantController.getNearbyRestaurants);

// Protected routes - Vendor (must come before /:id to avoid pattern matching)
router.post('/', protect, authorize('vendor'), createRestaurantRules, validate, restaurantController.createRestaurant);
router.get('/my-restaurants', protect, authorize('vendor'), restaurantController.getMyRestaurant);

// Public route with ID parameter
router.get('/:id', objectIdRule, validate, restaurantController.getRestaurant);

// Protected routes - Vendor/Admin
router.put('/:id', protect, authorize('vendor', 'admin'), objectIdRule, validate, restaurantController.updateRestaurant);
router.put('/:id/toggle-status', protect, authorize('vendor'), objectIdRule, validate, restaurantController.toggleRestaurantStatus);

// Protected routes - Admin
router.delete('/:id', protect, authorize('admin'), objectIdRule, validate, restaurantController.deleteRestaurant);

module.exports = router;
