const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { objectIdRule, validate } = require('../middleware/validator');

// All routes require authentication
router.use(protect);

router.get('/', notificationController.getNotifications);
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', objectIdRule, validate, notificationController.markAsRead);
router.delete('/:id', objectIdRule, validate, notificationController.deleteNotification);

module.exports = router;
