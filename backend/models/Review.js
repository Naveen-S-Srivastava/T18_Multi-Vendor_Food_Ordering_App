const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Review Type
  reviewType: {
    type: String,
    enum: ['restaurant', 'delivery', 'menuItem'],
    required: true
  },
  
  // Customer Reference
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  
  // Order Reference
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required']
  },
  
  // Restaurant Review
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    default: null
  },
  
  // Menu Item Review
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    default: null
  },
  
  // Delivery Partner Review
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  // Review Text
  comment: {
    type: String,
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    trim: true
  },
  
  // Detailed Ratings (for restaurant)
  detailedRatings: {
    food: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    service: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    packaging: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    }
  },
  
  // Delivery Ratings (for delivery partner)
  deliveryRatings: {
    timeliness: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    behaviour: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    }
  },
  
  // Review Images
  images: [{
    type: String
  }],
  
  // Helpful Votes
  helpfulCount: {
    type: Number,
    default: 0
  },
  
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Response from Restaurant/Admin
  response: {
    text: {
      type: String,
      maxlength: 500
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: {
      type: Date
    }
  },
  
  // Flags & Moderation
  isFlagged: {
    type: Boolean,
    default: false
  },
  
  flagReason: {
    type: String,
    enum: ['spam', 'inappropriate', 'fake', 'offensive', 'other'],
    default: null
  },
  
  isVerified: {
    type: Boolean,
    default: true // Verified means it's from a real order
  },
  
  isVisible: {
    type: Boolean,
    default: true
  },
  
  // Admin Moderation
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  moderatedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ customer: 1, order: 1 });
reviewSchema.index({ restaurant: 1, isVisible: 1, createdAt: -1 });
reviewSchema.index({ menuItem: 1, isVisible: 1 });
reviewSchema.index({ deliveryPartner: 1, isVisible: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ reviewType: 1 });

// Compound index to prevent duplicate reviews
reviewSchema.index(
  { customer: 1, order: 1, reviewType: 1, restaurant: 1 },
  { unique: true, sparse: true }
);

// Method to mark review as helpful
reviewSchema.methods.markAsHelpful = function(userId) {
  if (!this.helpfulBy.includes(userId)) {
    this.helpfulBy.push(userId);
    this.helpfulCount += 1;
  }
  return this;
};

// Method to add response
reviewSchema.methods.addResponse = function(text, responderId) {
  this.response = {
    text,
    respondedBy: responderId,
    respondedAt: new Date()
  };
  return this;
};

// Static method to calculate average rating for a restaurant
reviewSchema.statics.getRestaurantAverageRating = async function(restaurantId) {
  const result = await this.aggregate([
    {
      $match: {
        restaurant: restaurantId,
        reviewType: 'restaurant',
        isVisible: true
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 ? result[0] : { averageRating: 0, count: 0 };
};

// Static method to calculate average rating for a menu item
reviewSchema.statics.getMenuItemAverageRating = async function(menuItemId) {
  const result = await this.aggregate([
    {
      $match: {
        menuItem: menuItemId,
        reviewType: 'menuItem',
        isVisible: true
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 ? result[0] : { averageRating: 0, count: 0 };
};

// Static method to calculate average rating for a delivery partner
reviewSchema.statics.getDeliveryPartnerAverageRating = async function(deliveryPartnerId) {
  const result = await this.aggregate([
    {
      $match: {
        deliveryPartner: deliveryPartnerId,
        reviewType: 'delivery',
        isVisible: true
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 ? result[0] : { averageRating: 0, count: 0 };
};

module.exports = mongoose.model('Review', reviewSchema);
