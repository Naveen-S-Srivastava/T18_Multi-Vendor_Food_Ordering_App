const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  // Order Reference
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required'],
    unique: true
  },
  
  // Delivery Partner
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Assignment Status
  assignmentStatus: {
    type: String,
    enum: ['pending', 'assigned', 'accepted', 'rejected', 'reassigning'],
    default: 'pending'
  },
  
  // Delivery Status
  status: {
    type: String,
    enum: ['pending', 'assigned', 'on_the_way_to_pickup', 'arrived_at_restaurant', 'picked_up', 'on_the_way_to_customer', 'delivered', 'failed', 'cancelled'],
    default: 'pending'
  },
  
  // Pickup Details
  pickupLocation: {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    address: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String
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
    },
    contactPhone: String
  },
  
  // Drop Details
  dropLocation: {
    address: {
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
      }
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
    },
    contactPhone: {
      type: String,
      required: true
    }
  },
  
  // Distance & Time
  distance: {
    type: Number, // in kilometers
    default: 0
  },
  
  estimatedDuration: {
    type: Number, // in minutes
    default: 0
  },
  
  actualDuration: {
    type: Number, // in minutes
    default: null
  },
  
  // Real-time Tracking
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  
  // Location History for route tracking
  locationHistory: [{
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    speed: Number, // in km/h
    accuracy: Number // in meters
  }],
  
  // Time Tracking
  assignedAt: {
    type: Date,
    default: null
  },
  acceptedAt: {
    type: Date,
    default: null
  },
  startedAt: {
    type: Date,
    default: null
  },
  arrivedAtRestaurantAt: {
    type: Date,
    default: null
  },
  pickedUpAt: {
    type: Date,
    default: null
  },
  deliveredAt: {
    type: Date,
    default: null
  },
  
  // Delivery Proof
  deliveryProof: {
    photo: {
      type: String,
      default: null
    },
    signature: {
      type: String,
      default: null
    },
    otp: {
      type: String,
      default: null
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  
  // Earnings
  deliveryFee: {
    type: Number,
    required: true,
    default: 0
  },
  
  tip: {
    type: Number,
    default: 0
  },
  
  totalEarnings: {
    type: Number,
    default: 0
  },
  
  // Failed Delivery
  failureReason: {
    type: String,
    enum: [
      'customer_unavailable',
      'wrong_address',
      'customer_refused',
      'accident',
      'vehicle_breakdown',
      'other'
    ],
    default: null
  },
  
  failureNote: {
    type: String,
    maxlength: 500
  },
  
  // Attempts
  attemptCount: {
    type: Number,
    default: 0
  },
  
  maxAttempts: {
    type: Number,
    default: 3
  },
  
  // Assignment History (for reassignments)
  assignmentHistory: [{
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['assigned', 'accepted', 'rejected', 'timeout']
    },
    rejectionReason: String
  }],
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Special Instructions
  deliveryInstructions: {
    type: String,
    maxlength: 1000
  },
  
  // Ratings (after delivery)
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    review: {
      type: String,
      maxlength: 500
    },
    ratedAt: Date
  }
}, {
  timestamps: true
});

// Indexes
deliverySchema.index({ order: 1 });
deliverySchema.index({ deliveryPartner: 1, status: 1 });
deliverySchema.index({ status: 1, createdAt: -1 });
deliverySchema.index({ assignmentStatus: 1 });
deliverySchema.index({ 'pickupLocation.coordinates': '2dsphere' });
deliverySchema.index({ 'dropLocation.coordinates': '2dsphere' });
deliverySchema.index({ currentLocation: '2dsphere' });

// Method to calculate total earnings
deliverySchema.methods.calculateEarnings = function() {
  this.totalEarnings = this.deliveryFee + this.tip;
  return this.totalEarnings;
};

// Method to update current location
deliverySchema.methods.updateLocation = function(latitude, longitude, speed = null, accuracy = null) {
  this.currentLocation.coordinates = [longitude, latitude];
  
  this.locationHistory.push({
    coordinates: [longitude, latitude],
    timestamp: new Date(),
    speed,
    accuracy
  });
  
  // Keep only last 100 location points to avoid excessive data
  if (this.locationHistory.length > 100) {
    this.locationHistory = this.locationHistory.slice(-100);
  }
  
  return this;
};

// Method to check if delivery partner can accept
deliverySchema.methods.canBeAccepted = function() {
  return this.assignmentStatus === 'assigned' && this.status === 'assigned';
};

// Method to mark as picked up
deliverySchema.methods.markAsPickedUp = function() {
  this.status = 'picked_up';
  this.pickedUpAt = new Date();
  return this;
};

// Method to mark as delivered
deliverySchema.methods.markAsDelivered = function(proofData = {}) {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  
  if (this.startedAt) {
    this.actualDuration = Math.round((this.deliveredAt - this.startedAt) / (1000 * 60));
  }
  
  if (proofData.photo) this.deliveryProof.photo = proofData.photo;
  if (proofData.signature) this.deliveryProof.signature = proofData.signature;
  if (proofData.otp) this.deliveryProof.otp = proofData.otp;
  if (proofData.notes) this.deliveryProof.notes = proofData.notes;
  
  this.calculateEarnings();
  return this;
};

// Pre-save hook to update timestamps based on status changes
deliverySchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'assigned':
        if (!this.assignedAt) this.assignedAt = now;
        break;
      case 'on_the_way_to_pickup':
        if (!this.startedAt) this.startedAt = now;
        break;
      case 'arrived_at_restaurant':
        if (!this.arrivedAtRestaurantAt) this.arrivedAtRestaurantAt = now;
        break;
      case 'picked_up':
        if (!this.pickedUpAt) this.pickedUpAt = now;
        break;
      case 'delivered':
        if (!this.deliveredAt) this.deliveredAt = now;
        this.calculateEarnings();
        break;
    }
  }
  
  next();
});

module.exports = mongoose.model('Delivery', deliverySchema);
