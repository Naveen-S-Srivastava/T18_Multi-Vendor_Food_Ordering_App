const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  // Coupon Code
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z0-9]+$/, 'Coupon code can only contain uppercase letters and numbers']
  },
  
  // Coupon Details
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: 200
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 500
  },
  
  // Discount Type
  discountType: {
    type: String,
    enum: ['percentage', 'flat', 'free_delivery'],
    required: true
  },
  
  // Discount Value
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: 0
  },
  
  maxDiscountAmount: {
    type: Number, // For percentage discounts
    default: null
  },
  
  // Usage Conditions
  minOrderAmount: {
    type: Number,
    default: 0
  },
  
  maxOrderAmount: {
    type: Number,
    default: null
  },
  
  // Validity
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  validUntil: {
    type: Date,
    required: true
  },
  
  // Usage Limits
  maxUsageCount: {
    type: Number,
    default: null // null means unlimited
  },
  
  currentUsageCount: {
    type: Number,
    default: 0
  },
  
  maxUsagePerUser: {
    type: Number,
    default: 1
  },
  
  // Applicable To
  applicableTo: {
    type: String,
    enum: ['all', 'specific_restaurants', 'specific_users', 'new_users', 'first_order'],
    default: 'all'
  },
  
  applicableRestaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  
  applicableUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Payment Method Restriction
  applicablePaymentMethods: [{
    type: String,
    enum: ['cod', 'online', 'wallet', 'upi']
  }],
  
  // Days & Time Restrictions
  applicableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  
  applicableTimeSlots: [{
    startTime: String, // Format: "HH:MM"
    endTime: String
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Auto-apply
  isAutoApply: {
    type: Boolean,
    default: false
  },
  
  // Creator
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Usage Tracking
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    discountAmount: Number
  }],
  
  // Metadata
  tags: [{
    type: String
  }],
  
  termsAndConditions: {
    type: String,
    maxlength: 2000
  }
}, {
  timestamps: true
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
couponSchema.index({ applicableTo: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  
  // Check if active
  if (!this.isActive) return { valid: false, reason: 'Coupon is not active' };
  
  // Check validity period
  if (now < this.validFrom) return { valid: false, reason: 'Coupon is not yet valid' };
  if (now > this.validUntil) return { valid: false, reason: 'Coupon has expired' };
  
  // Check usage limit
  if (this.maxUsageCount && this.currentUsageCount >= this.maxUsageCount) {
    return { valid: false, reason: 'Coupon usage limit reached' };
  }
  
  return { valid: true };
};

// Method to check if user can use this coupon
couponSchema.methods.canBeUsedBy = function(userId, orderAmount) {
  // Check validity first
  const validityCheck = this.isValid();
  if (!validityCheck.valid) return validityCheck;
  
  // Check min order amount
  if (orderAmount < this.minOrderAmount) {
    return { 
      valid: false, 
      reason: `Minimum order amount of ₹${this.minOrderAmount} required` 
    };
  }
  
  // Check max order amount
  if (this.maxOrderAmount && orderAmount > this.maxOrderAmount) {
    return { 
      valid: false, 
      reason: `Maximum order amount of ₹${this.maxOrderAmount} exceeded` 
    };
  }
  
  // Check user-specific usage
  if (this.applicableTo === 'specific_users') {
    if (!this.applicableUsers.some(id => id.toString() === userId.toString())) {
      return { valid: false, reason: 'This coupon is not applicable to your account' };
    }
  }
  
  // Check per-user usage limit
  const userUsageCount = this.usedBy.filter(
    usage => usage.user.toString() === userId.toString()
  ).length;
  
  if (userUsageCount >= this.maxUsagePerUser) {
    return { valid: false, reason: 'You have already used this coupon' };
  }
  
  return { valid: true };
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(orderAmount) {
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (orderAmount * this.discountValue) / 100;
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
  } else if (this.discountType === 'flat') {
    discount = this.discountValue;
  }
  
  return Math.min(discount, orderAmount);
};

// Method to apply coupon
couponSchema.methods.applyCoupon = function(userId, orderId, discountAmount) {
  this.usedBy.push({
    user: userId,
    order: orderId,
    usedAt: new Date(),
    discountAmount
  });
  
  this.currentUsageCount += 1;
  return this;
};

module.exports = mongoose.model('Coupon', couponSchema);
