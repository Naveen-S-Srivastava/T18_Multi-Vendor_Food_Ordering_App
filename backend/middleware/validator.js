const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation error handler
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Auth validation rules
 */
exports.registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['customer', 'vendor', 'delivery', 'admin']).withMessage('Invalid role')
];

exports.loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

/**
 * Restaurant validation rules
 */
exports.createRestaurantRules = [
  body('name').trim().notEmpty().withMessage('Restaurant name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid phone number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.pincode').matches(/^[0-9]{6}$/).withMessage('Valid pincode is required'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required')
];

/**
 * Menu item validation rules
 */
exports.createMenuItemRules = [
  body('name').trim().notEmpty().withMessage('Item name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('foodType').isIn(['Veg', 'Non-Veg', 'Vegan', 'Egg']).withMessage('Valid food type is required')
];

/**
 * Order validation rules
 */
exports.createOrderRules = [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
  body('payment.method').isIn(['cod', 'online', 'wallet', 'upi']).withMessage('Valid payment method required')
];

/**
 * Review validation rules
 */
exports.createReviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
];

/**
 * Common validation rules
 */
exports.objectIdRule = param('id').isMongoId().withMessage('Invalid ID format');

exports.paginationRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];
