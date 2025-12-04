const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  // Customer Reference
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required'],
    unique: true
  },
  
  // Multi-Vendor Cart: Items grouped by restaurant
  restaurants: [{
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
        min: 1,
        default: 1
      },
      // Selected variant options
      selectedVariants: [{
        name: String, // e.g., "Size"
        option: String, // e.g., "Large"
        price: Number // Additional price
      }],
      // Selected add-ons
      selectedAddOns: [{
        name: String, // e.g., "Extra Cheese"
        price: Number
      }],
      // Special instructions for this item
      instructions: {
        type: String,
        maxlength: 500
      },
      // Subtotal for this item (price + variants + add-ons) * quantity
      subtotal: {
        type: Number,
        required: true
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }],
    // Restaurant-level subtotal
    subtotal: {
      type: Number,
      default: 0
    },
    // Restaurant-specific delivery fee
    deliveryFee: {
      type: Number,
      default: 0
    },
    // Special instructions for this restaurant's order
    specialInstructions: {
      type: String,
      maxlength: 1000
    }
  }],
  
  // Cart Summary
  summary: {
    totalItems: {
      type: Number,
      default: 0
    },
    itemsTotal: {
      type: Number,
      default: 0
    },
    totalDeliveryFee: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      default: 0
    }
  },
  
  // Applied Coupon
  appliedCoupon: {
    code: String,
    discountAmount: {
      type: Number,
      default: 0
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'flat'
    }
  },
  
  // Delivery Address (selected from user's addresses)
  selectedAddress: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  
  // Cart expiry (auto-clear old carts)
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}, {
  timestamps: true
});

// Indexes
cartSchema.index({ customer: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion

// Method to calculate cart totals
cartSchema.methods.calculateTotals = function() {
  let totalItems = 0;
  let itemsTotal = 0;
  let totalDeliveryFee = 0;
  
  this.restaurants.forEach(restaurant => {
    let restaurantSubtotal = 0;
    
    restaurant.items.forEach(item => {
      // Calculate item subtotal
      let itemPrice = item.price;
      
      // Add variant prices
      if (item.selectedVariants && item.selectedVariants.length > 0) {
        item.selectedVariants.forEach(variant => {
          itemPrice += variant.price || 0;
        });
      }
      
      // Add add-on prices
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        item.selectedAddOns.forEach(addOn => {
          itemPrice += addOn.price || 0;
        });
      }
      
      item.subtotal = itemPrice * item.quantity;
      restaurantSubtotal += item.subtotal;
      totalItems += item.quantity;
    });
    
    restaurant.subtotal = restaurantSubtotal;
    itemsTotal += restaurantSubtotal;
    totalDeliveryFee += restaurant.deliveryFee || 0;
  });
  
  // Update summary
  this.summary.totalItems = totalItems;
  this.summary.itemsTotal = itemsTotal;
  this.summary.totalDeliveryFee = totalDeliveryFee;
  
  // Calculate final amount (subtract coupon discount if applied)
  let discountAmount = 0;
  if (this.appliedCoupon && this.appliedCoupon.code) {
    if (this.appliedCoupon.discountType === 'percentage') {
      discountAmount = (itemsTotal * this.appliedCoupon.discountAmount) / 100;
    } else {
      discountAmount = this.appliedCoupon.discountAmount;
    }
  }
  
  this.summary.totalAmount = itemsTotal + totalDeliveryFee - discountAmount;
  
  return this.summary;
};

// Method to add item to cart
cartSchema.methods.addItem = async function(restaurantId, itemData) {
  // Find or create restaurant entry in cart
  let restaurantCart = this.restaurants.find(
    r => r.restaurant.toString() === restaurantId.toString()
  );
  
  if (!restaurantCart) {
    restaurantCart = {
      restaurant: restaurantId,
      items: [],
      subtotal: 0,
      deliveryFee: 0
    };
    this.restaurants.push(restaurantCart);
  }
  
  // Check if exact same item with same variants/add-ons exists
  const existingItemIndex = restaurantCart.items.findIndex(item => {
    if (item.menuItem.toString() !== itemData.menuItem.toString()) return false;
    
    // Compare variants
    const variantsMatch = JSON.stringify(item.selectedVariants || []) === 
                         JSON.stringify(itemData.selectedVariants || []);
    
    // Compare add-ons
    const addOnsMatch = JSON.stringify(item.selectedAddOns || []) === 
                       JSON.stringify(itemData.selectedAddOns || []);
    
    return variantsMatch && addOnsMatch;
  });
  
  if (existingItemIndex !== -1) {
    // Update quantity of existing item
    restaurantCart.items[existingItemIndex].quantity += itemData.quantity || 1;
  } else {
    // Add new item
    restaurantCart.items.push({
      ...itemData,
      addedAt: new Date()
    });
  }
  
  this.calculateTotals();
  return await this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function(restaurantId, itemId) {
  const restaurantCart = this.restaurants.find(
    r => r.restaurant.toString() === restaurantId.toString()
  );
  
  if (!restaurantCart) return this;
  
  restaurantCart.items = restaurantCart.items.filter(
    item => item._id.toString() !== itemId.toString()
  );
  
  // Remove restaurant if no items left
  if (restaurantCart.items.length === 0) {
    this.restaurants = this.restaurants.filter(
      r => r.restaurant.toString() !== restaurantId.toString()
    );
  }
  
  this.calculateTotals();
  return await this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = async function(restaurantId, itemId, quantity) {
  const restaurantCart = this.restaurants.find(
    r => r.restaurant.toString() === restaurantId.toString()
  );
  
  if (!restaurantCart) return this;
  
  const item = restaurantCart.items.find(
    item => item._id.toString() === itemId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      return await this.removeItem(restaurantId, itemId);
    }
    item.quantity = quantity;
  }
  
  this.calculateTotals();
  return await this.save();
};

// Method to clear entire cart
cartSchema.methods.clearCart = async function() {
  this.restaurants = [];
  this.appliedCoupon = undefined;
  this.calculateTotals();
  return await this.save();
};

// Method to clear cart for specific restaurant
cartSchema.methods.clearRestaurantCart = async function(restaurantId) {
  this.restaurants = this.restaurants.filter(
    r => r.restaurant.toString() !== restaurantId.toString()
  );
  this.calculateTotals();
  return await this.save();
};

// Pre-save hook to calculate totals
cartSchema.pre('save', function(next) {
  if (this.isModified('restaurants') || this.isModified('appliedCoupon')) {
    this.calculateTotals();
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
