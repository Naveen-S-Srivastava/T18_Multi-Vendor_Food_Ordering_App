const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { createReviewRules, objectIdRule, validate } = require('../middleware/validator');

// Public routes
router.get('/', optionalAuth, reviewController.getReviews);
router.get('/:id', objectIdRule, validate, reviewController.getReview);

// Protected routes
router.post('/', protect, authorize('customer'), createReviewRules, validate, reviewController.createReview);
router.post('/:id/response', protect, authorize('vendor'), objectIdRule, validate, reviewController.addResponse);
router.put('/:id/helpful', protect, objectIdRule, validate, reviewController.markAsHelpful);

module.exports = router;
