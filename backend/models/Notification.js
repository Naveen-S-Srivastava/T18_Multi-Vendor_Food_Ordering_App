const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  
  // Notification Type
  type: {
    type: String,
    enum: [
      // Order related
      'order_placed',
      'order_confirmed',
      'order_preparing',
      'order_ready',
      'order_picked',
      'order_on_the_way',
      'order_delivered',
      'order_cancelled',
      // Payment related
      'payment_success',
      'payment_failed',
      'refund_initiated',
      'refund_completed',
      // Delivery related
      'delivery_assigned',
      'delivery_nearby',
      // Restaurant related
      'new_order_received',
      'menu_approved',
      'restaurant_verified',
      // Promotional
      'offer_available',
      'discount_coupon',
      // System
      'account_verified',
      'password_reset',
      'login_alert',
      'other'
    ],
    required: true
  },
  
  // Title & Message
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: 200
  },
  
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: 1000
  },
  
  // Rich Content
  image: {
    type: String,
    default: null
  },
  
  icon: {
    type: String,
    default: null
  },
  
  // Action/Deep Link
  actionUrl: {
    type: String,
    default: null
  },
  
  actionType: {
    type: String,
    enum: ['navigate', 'web_url', 'none'],
    default: 'none'
  },
  
  // Related References
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  
  relatedRestaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    default: null
  },
  
  relatedDelivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
    default: null
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false
  },
  
  readAt: {
    type: Date,
    default: null
  },
  
  // Delivery Status
  deliveryStatus: {
    push: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      error: String
    },
    email: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      error: String
    },
    sms: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      error: String
    }
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Scheduling
  scheduledFor: {
    type: Date,
    default: null
  },
  
  isSent: {
    type: Boolean,
    default: false
  },
  
  sentAt: {
    type: Date,
    default: null
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Expiry
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ relatedOrder: 1 });
notificationSchema.index({ isSent: 1, scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this;
};

// Method to mark as sent
notificationSchema.methods.markAsSent = function(channel = 'push', error = null) {
  if (!this.deliveryStatus[channel]) {
    this.deliveryStatus[channel] = {};
  }
  
  this.deliveryStatus[channel].sent = error ? false : true;
  this.deliveryStatus[channel].sentAt = new Date();
  
  if (error) {
    this.deliveryStatus[channel].error = error;
  }
  
  // Check if at least one channel succeeded
  const anySent = this.deliveryStatus.push?.sent || 
                  this.deliveryStatus.email?.sent || 
                  this.deliveryStatus.sms?.sent;
  
  if (anySent) {
    this.isSent = true;
    this.sentAt = new Date();
  }
  
  return this;
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    recipient: userId,
    isRead: false
  });
};

// Static method to mark all as read for a user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

module.exports = mongoose.model('Notification', notificationSchema);
