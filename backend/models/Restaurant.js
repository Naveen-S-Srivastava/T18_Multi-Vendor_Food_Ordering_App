const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  // Vendor/Owner Reference
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Restaurant owner is required']
  },
  
  // Basic Information
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [200, 'Restaurant name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Images
  logo: {
    type: String,
    default: null
  },
  banner: {
    type: String,
    default: null
  },
  images: [{
    type: String
  }],
  
  // Contact Information
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  
  // Location
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
      required: true,
      match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
    },
    landmark: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  
  // Business Details
  cuisineTypes: [{
    type: String,
    enum: ['Indian', 'Chinese', 'Italian', 'Mexican', 'Continental', 'Fast Food', 'Desserts', 'Beverages', 'South Indian', 'North Indian', 'Thai', 'Japanese', 'Mediterranean', 'American', 'Other']
  }],
  
  foodTypes: [{
    type: String,
    enum: ['Veg', 'Non-Veg', 'Vegan', 'Gluten-Free']
  }],
  
  priceRange: {
    type: String,
    enum: ['₹', '₹₹', '₹₹₹', '₹₹₹₹'],
    default: '₹₹'
  },
  
  // Operating Hours
  operatingHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    openTime: {
      type: String, // Format: "HH:MM" (24-hour)
      required: true
    },
    closeTime: {
      type: String, // Format: "HH:MM" (24-hour)
      required: true
    }
  }],
  
  // Delivery Settings
  deliverySettings: {
    isDeliveryAvailable: {
      type: Boolean,
      default: true
    },
    deliveryRadius: {
      type: Number, // in kilometers
      default: 10,
      min: 1,
      max: 50
    },
    minOrderAmount: {
      type: Number,
      default: 0
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    deliveryTime: {
      type: String, // e.g., "30-40 mins"
      default: "30-40 mins"
    },
    freeDeliveryAbove: {
      type: Number,
      default: null
    }
  },
  
  // Ratings & Reviews
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Business Metrics
  totalOrders: {
    type: Number,
    default: 0
  },
  
  revenue: {
    total: {
      type: Number,
      default: 0
    },
    thisMonth: {
      type: Number,
      default: 0
    },
    lastMonth: {
      type: Number,
      default: 0
    }
  },
  
  // Licenses & Verification
  fssaiLicense: {
    type: String,
    default: null
  },
  gstNumber: {
    type: String,
    default: null
  },
  
  // Status
  isOpen: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Commission
  commissionRate: {
    type: Number,
    default: 15, // percentage
    min: 0,
    max: 100
  },
  
  // Tags & Features
  tags: [{
    type: String
  }],
  features: [{
    type: String,
    enum: ['Outdoor Seating', 'Home Delivery', 'Takeaway', 'Pure Veg', 'Live Music', 'Parking Available', 'Cards Accepted', 'Wallet Accepted']
  }],
  
  // Metadata
  verificationDocuments: [{
    documentType: String,
    documentUrl: String,
    uploadedAt: Date
  }],
  
  rejectionReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ owner: 1 });
restaurantSchema.index({ name: 'text', description: 'text' });
restaurantSchema.index({ cuisineTypes: 1 });
restaurantSchema.index({ 'rating.average': -1 });
restaurantSchema.index({ isActive: 1, isVerified: 1, isOpen: 1 });

// Virtual for menu items
restaurantSchema.virtual('menuItems', {
  ref: 'MenuItem',
  localField: '_id',
  foreignField: 'restaurant'
});

// Method to check if restaurant is currently open
restaurantSchema.methods.isCurrentlyOpen = function() {
  if (!this.isOpen || !this.isActive) return false;
  
  const now = new Date();
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const todayHours = this.operatingHours.find(h => h.day === dayName);
  
  if (!todayHours || !todayHours.isOpen) return false;
  
  return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
};

module.exports = mongoose.model('Restaurant', restaurantSchema);
