const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');
const { Notification } = require('../models');

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, isRead } = req.query;

  const query = { recipient: req.user.id };

  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Notification.countDocuments(query);
  const unreadCount = await Notification.getUnreadCount(req.user.id);

  res.status(200).json({
    success: true,
    count: notifications.length,
    total: count,
    unreadCount,
    data: notifications
  });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  // Check ownership
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  notification.markAsRead();
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification
  });
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.markAllAsRead(req.user.id);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  // Check ownership
  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  await notification.remove();

  res.status(200).json({
    success: true,
    message: 'Notification deleted',
    data: {}
  });
});
