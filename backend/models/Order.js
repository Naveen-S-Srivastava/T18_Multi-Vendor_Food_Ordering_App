const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order Identification
  orderNumber: {
    type: String,
    unique: true,
  },
  
  // Customer Reference
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  
  // Restaurant Reference (for single vendor orders, or primary restaurant)
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant is required']
  },
  
  // Multi-Vendor Support: Sub-orders for each restaurant
  subOrders: [{
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    items: [{
      menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      image: String,
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      // Selected variant (e.g., "Size: Large")
      selectedVariants: [{
        name: String,
        option: String,
        price: Number
      }],
      // Selected add-ons
      selectedAddOns: [{
        name: String,
        price: Number
      }],
      // Special instructions for this item
      instructions: {
        type: String,
        maxlength: 500
      },
      subtotal: {
        type: Number,
        required: true
      }
    }],
    subtotal: {
      type: Number,
      required: true
    },
    vendorStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'preparing', 'ready', 'picked', 'delivered'],
      default: 'pending'
    },
    rejectionReason: String,
    preparationTime: Number // estimated time in minutes
  }],
  
  // Order Items (for backward compatibility and simple queries)
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: String,
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    selectedVariants: [{
      name: String,
      option: String,
      price: Number
    }],
    selectedAddOns: [{
      name: String,
      price: Number
    }],
    instructions: {
      type: String,
      maxlength: 500
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  
  // Delivery Information
  deliveryAddress: {
    label: String,
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  
  customerPhone: {
    type: String,
    required: true
  },
  
  // Delivery Partner
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  deliveryDistance: {
    type: Number, // in kilometers
    default: 0
  },
  
  // Pricing Breakdown
  pricing: {
    itemsTotal: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    packagingCharges: {
      type: Number,
      default: 0
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    couponDiscount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  
  // Coupon Applied
  couponCode: {
    type: String,
    default: null
  },
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['cod', 'online', 'wallet', 'upi'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      default: null
    },
    paidAt: {
      type: Date,
      default: null
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    refundedAt: {
      type: Date,
      default: null
    }
  },
  
  // Order Status Tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'picked', 'on_the_way', 'delivered', 'cancelled', 'rejected'],
    default: 'pending'
  },
  
  // Status Timeline
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  
  // Time Tracking
  estimatedDeliveryTime: {
    type: Date,
    required: true
  },
  
  acceptedAt: Date,
  preparingAt: Date,
  readyAt: Date,
  pickedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  
  // Cancellation & Rejection
  cancellationReason: {
    type: String,
    default: null
  },
  cancelledBy: {
    type: String,
    enum: ['customer', 'vendor', 'admin', 'system'],
    default: null
  },
  
  // Special Instructions
  specialInstructions: {
    type: String,
    maxlength: 1000
  },
  
  // Ratings & Reviews (after delivery)
  isRated: {
    type: Boolean,
    default: false
  },
  
  // Commission & Settlement
  commission: {
    rate: {
      type: Number,
      default: 15 // percentage
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  
  vendorEarnings: {
    type: Number,
    default: 0
  },
  
  deliveryEarnings: {
    type: Number,
    default: 0
  },
  
  isSettled: {
    type: Boolean,
    default: false
  },
  
  settledAt: {
    type: Date,
    default: null
  },
  
  // Order Type
  orderType: {
    type: String,
    enum: ['delivery', 'pickup'],
    default: 'delivery'
  },
  
  // Scheduled Order
  isScheduled: {
    type: Boolean,
    default: false
  },
  scheduledFor: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1, createdAt: -1 });
orderSchema.index({ deliveryPartner: 1, status: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'deliveryAddress.coordinates': '2dsphere' });

// Pre-save hook to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD${timestamp}${random}`;
  }
  
  // Add to status history
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  
  next();
});

// Method to calculate vendor earnings
orderSchema.methods.calculateVendorEarnings = function() {
  const commissionAmount = (this.pricing.totalAmount * this.commission.rate) / 100;
  this.commission.amount = commissionAmount;
  this.vendorEarnings = this.pricing.totalAmount - commissionAmount - this.deliveryEarnings;
  return this.vendorEarnings;
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  const cancelableStatuses = ['pending', 'confirmed'];
  return cancelableStatuses.includes(this.status);
};

module.exports = mongoose.model('Order', orderSchema);
