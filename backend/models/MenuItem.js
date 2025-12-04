const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  // Restaurant Reference
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant is required']
  },
  
  // Category Reference
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  
  // Basic Information
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [200, 'Item name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Images
  image: {
    type: String,
    default: null
  },
  images: [{
    type: String
  }],
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    default: null // For showing discounts
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Food Type & Dietary Info
  foodType: {
    type: String,
    enum: ['Veg', 'Non-Veg', 'Vegan', 'Egg'],
    required: true
  },
  
  // Customization Options (Variants/Add-ons)
  variants: [{
    name: {
      type: String,
      required: true // e.g., "Size", "Spice Level"
    },
    options: [{
      label: {
        type: String,
        required: true // e.g., "Regular", "Large", "Medium"
      },
      price: {
        type: Number,
        default: 0 // Additional price for this variant
      }
    }],
    isRequired: {
      type: Boolean,
      default: false
    }
  }],
  
  addOns: [{
    name: {
      type: String,
      required: true // e.g., "Extra Cheese", "Garlic Bread"
    },
    price: {
      type: Number,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  
  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  },
  availableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  availableTimeSlots: [{
    startTime: String, // Format: "HH:MM"
    endTime: String    // Format: "HH:MM"
  }],
  
  // Stock Management
  stockQuantity: {
    type: Number,
    default: null // null means unlimited
  },
  lowStockThreshold: {
    type: Number,
    default: 5
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
  
  // Performance Metrics
  totalOrders: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  
  // Additional Info
  preparationTime: {
    type: Number, // in minutes
    default: 20
  },
  servesCount: {
    type: Number,
    default: 1 // Number of people it serves
  },
  calories: {
    type: Number,
    default: null
  },
  
  // Tags & Features
  tags: [{
    type: String // e.g., "Bestseller", "Chef's Special", "New", "Spicy", "Healthy"
  }],
  allergens: [{
    type: String // e.g., "Nuts", "Dairy", "Gluten"
  }],
  
  // Special Flags
  isBestseller: {
    type: Boolean,
    default: false
  },
  isRecommended: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  
  // Display Order
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
menuItemSchema.index({ restaurant: 1, isAvailable: 1 });
menuItemSchema.index({ category: 1, displayOrder: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ foodType: 1 });
menuItemSchema.index({ 'rating.average': -1 });
menuItemSchema.index({ price: 1 });
menuItemSchema.index({ isBestseller: 1, isRecommended: 1 });

// Virtual to check if item is in stock
menuItemSchema.virtual('isInStock').get(function() {
  if (this.stockQuantity === null) return true; // Unlimited stock
  return this.stockQuantity > 0;
});

// Method to calculate final price with discount
menuItemSchema.methods.getFinalPrice = function() {
  if (this.discountPercentage > 0 && this.originalPrice) {
    return this.originalPrice * (1 - this.discountPercentage / 100);
  }
  return this.price;
};

// Method to check if item is available at current time
menuItemSchema.methods.isAvailableNow = function() {
  if (!this.isAvailable) return false;
  
  const now = new Date();
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
  
  // Check if available today
  if (this.availableDays.length > 0 && !this.availableDays.includes(dayName)) {
    return false;
  }
  
  // Check time slots if defined
  if (this.availableTimeSlots.length > 0) {
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isInTimeSlot = this.availableTimeSlots.some(slot => 
      currentTime >= slot.startTime && currentTime <= slot.endTime
    );
    return isInTimeSlot;
  }
  
  return true;
};

// Pre-save hook to calculate price if discount is applied
menuItemSchema.pre('save', function(next) {
  if (this.originalPrice && this.discountPercentage > 0) {
    this.price = this.originalPrice * (1 - this.discountPercentage / 100);
  }
  next();
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
