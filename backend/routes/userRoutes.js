const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { objectIdRule, validate } = require('../middleware/validator');

// All routes require admin access
router.use(protect, authorize('admin'));

router.get('/', userController.getUsers);
router.get('/stats', userController.getUserStats);
router.get('/:id', objectIdRule, validate, userController.getUser);
router.put('/:id', objectIdRule, validate, userController.updateUser);
router.delete('/:id', objectIdRule, validate, userController.deleteUser);
router.put('/:id/toggle-status', objectIdRule, validate, userController.toggleUserStatus);

module.exports = router;
