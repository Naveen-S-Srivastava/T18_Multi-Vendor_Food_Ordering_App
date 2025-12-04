const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerRules, loginRules, validate } = require('../middleware/validator');

// Public routes
router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

// Address management
router.post('/addresses', protect, authController.addAddress);
router.put('/addresses/:addressId', protect, authController.updateAddress);
router.delete('/addresses/:addressId', protect, authController.deleteAddress);

module.exports = router;
