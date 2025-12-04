const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Transaction ID (from payment gateway)
  transactionId: {
    type: String,
    unique: true,
    required: [true, 'Transaction ID is required']
  },
  
  // Gateway Order ID (Razorpay order_id, Stripe payment_intent, etc.)
  gatewayOrderId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Order Reference
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required']
  },
  
  // Customer Reference
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  
  // Payment Gateway
  gateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'paytm', 'phonepe', 'googlepay', 'upi', 'cod', 'wallet'],
    required: true
  },
  
  // Payment Method
  method: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cod', 'emi'],
    required: true
  },
  
  // Payment Details
  methodDetails: {
    cardType: String, // visa, mastercard, rupay
    cardLast4: String,
    cardNetwork: String,
    upiId: String,
    walletType: String, // paytm, phonepe, googlepay, etc.
    bankName: String
  },
  
  // Amount Details
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  
  currency: {
    type: String,
    default: 'INR',
    uppercase: true
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['initiated', 'pending', 'processing', 'success', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'initiated'
  },
  
  // Timestamps
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  
  completedAt: {
    type: Date,
    default: null
  },
  
  // Refund Details
  refund: {
    amount: {
      type: Number,
      default: 0
    },
    reason: {
      type: String,
      enum: ['customer_request', 'order_cancelled', 'failed_delivery', 'quality_issue', 'duplicate_payment', 'other']
    },
    refundId: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed']
    },
    initiatedAt: Date,
    completedAt: Date,
    failureReason: String
  },
  
  // Gateway Response
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Error Details
  errorCode: {
    type: String,
    default: null
  },
  
  errorDescription: {
    type: String,
    default: null
  },
  
  // Retry Information
  retryCount: {
    type: Number,
    default: 0
  },
  
  maxRetries: {
    type: Number,
    default: 3
  },
  
  // Settlement
  isSettled: {
    type: Boolean,
    default: false
  },
  
  settledAt: {
    type: Date,
    default: null
  },
  
  settlementAmount: {
    type: Number,
    default: 0
  },
  
  // Gateway Fees
  gatewayFees: {
    type: Number,
    default: 0
  },
  
  taxOnGatewayFees: {
    type: Number,
    default: 0
  },
  
  netAmount: {
    type: Number,
    default: 0
  },
  
  // Customer IP & Device Info (for fraud detection)
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceId: String,
    location: {
      city: String,
      state: String,
      country: String
    }
  },
  
  // Notes
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ customer: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ gateway: 1, status: 1 });
paymentSchema.index({ isSettled: 1 });

// Method to mark payment as successful
paymentSchema.methods.markAsSuccess = function(gatewayResponse = {}) {
  this.status = 'success';
  this.completedAt = new Date();
  this.gatewayResponse = gatewayResponse;
  this.calculateNetAmount();
  return this;
};

// Method to mark payment as failed
paymentSchema.methods.markAsFailed = function(errorCode, errorDescription) {
  this.status = 'failed';
  this.errorCode = errorCode;
  this.errorDescription = errorDescription;
  this.completedAt = new Date();
  return this;
};

// Method to initiate refund
paymentSchema.methods.initiateRefund = function(amount, reason) {
  this.refund = {
    amount: amount || this.amount,
    reason,
    status: 'pending',
    initiatedAt: new Date()
  };
  
  if (amount < this.amount) {
    this.status = 'partially_refunded';
  } else {
    this.status = 'refunded';
  }
  
  return this;
};

// Method to complete refund
paymentSchema.methods.completeRefund = function(refundId) {
  this.refund.status = 'completed';
  this.refund.refundId = refundId;
  this.refund.completedAt = new Date();
  return this;
};

// Method to calculate net amount after fees
paymentSchema.methods.calculateNetAmount = function() {
  this.netAmount = this.amount - this.gatewayFees - this.taxOnGatewayFees;
  return this.netAmount;
};

// Pre-save hook
paymentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'success') {
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
    this.calculateNetAmount();
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
