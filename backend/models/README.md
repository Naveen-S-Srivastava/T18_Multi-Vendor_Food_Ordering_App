# MongoDB Schema Models - Multi-Vendor Food Ordering App

## 📋 Overview

Comprehensive MongoDB schema models for a multi-vendor food ordering platform with support for customers, vendors, delivery partners, and admin roles.

## 🗂️ Schema Structure

### 1. **User Schema** (`User.js`)
Multi-role user management supporting:
- **Customers**: With multiple delivery addresses, order history
- **Vendors**: Restaurant owners with business profiles
- **Delivery Partners**: With vehicle details, location tracking, earnings
- **Admins**: System administrators

**Key Features:**
- Password hashing with bcrypt
- Role-based access control
- Multi-address support with geolocation
- Delivery partner real-time location tracking
- FCM token for push notifications

### 2. **Restaurant Schema** (`Restaurant.js`)
Complete restaurant/vendor profile management:

**Key Features:**
- Business information (name, description, images)
- Location with 2dsphere geospatial indexing
- Cuisine types and food preferences
- Operating hours by day
- Delivery settings (radius, fees, minimum order)
- Ratings and revenue tracking
- FSSAI license and GST integration
- Commission rate configuration

### 3. **Category & MenuItem Schemas** (`Category.js`, `MenuItem.js`)

**Category:**
- Menu organization by restaurant
- Display ordering
- Active/inactive status

**MenuItem:**
- Rich product details with images
- Pricing with discount support
- Variants (sizes, spice levels)
- Add-ons (extra toppings, sides)
- Stock management
- Availability scheduling
- Ratings and performance metrics
- Tags (Bestseller, New, Chef's Special)

### 4. **Cart Schema** (`Cart.js`)
Multi-vendor cart with intelligent grouping:

**Key Features:**
- Items grouped by restaurant
- Variant and add-on selection
- Real-time total calculation
- Coupon application
- Auto-expiry after 7 days
- Helper methods for add/remove/update items

### 5. **Order Schema** (`Order.js`)
Comprehensive order management with multi-vendor support:

**Key Features:**
- Sub-orders for each restaurant in multi-vendor orders
- Complete pricing breakdown
- Status tracking with history
- Payment integration (COD, UPI, Card, Wallet)
- Delivery address with coordinates
- Commission and settlement tracking
- Scheduled order support
- Cancellation and refund handling

### 6. **Delivery Schema** (`Delivery.js`)
Real-time delivery tracking and management:

**Key Features:**
- Pickup and drop location with coordinates
- Real-time location tracking with history
- Status tracking (pending → assigned → picked → delivered)
- Distance and duration calculation
- Delivery proof (photo, signature, OTP)
- Earnings calculation (fee + tip)
- Assignment history for reassignments
- Failed delivery handling

### 7. **Review Schema** (`Review.js`)
Ratings and reviews for restaurants, items, and delivery:

**Key Features:**
- Multi-type reviews (restaurant, menu item, delivery)
- Detailed ratings breakdown
- Image uploads
- Helpful votes
- Vendor responses
- Moderation and flagging
- Aggregate rating calculations

### 8. **Payment Schema** (`Payment.js`)
Complete payment transaction management:

**Key Features:**
- Multi-gateway support (Razorpay, Stripe, PayTM, UPI)
- Transaction tracking
- Refund management (full/partial)
- Settlement calculations
- Gateway fee tracking
- Fraud detection metadata
- Retry mechanism

### 9. **Notification Schema** (`Notification.js`)
Multi-channel notification system:

**Key Features:**
- Push, Email, SMS support
- Order status notifications
- Promotional notifications
- Deep linking support
- Read/unread tracking
- Priority levels
- Scheduled notifications
- Auto-expiry after 30 days

### 10. **Coupon Schema** (`Coupon.js`)
Flexible coupon and discount management:

**Key Features:**
- Multiple discount types (percentage, flat, free delivery)
- Usage limits (total and per user)
- Restaurant-specific coupons
- User-specific coupons
- Time and day restrictions
- Payment method restrictions
- Auto-apply coupons
- Usage tracking

## 🔧 Installation

### Prerequisites
```bash
npm install mongoose bcryptjs
```

### Database Configuration

Create a `config/database.js` file:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Environment Variables
Create a `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/food_ordering_app
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/food_ordering_app
```

## 📦 Usage

### Import All Models
```javascript
const {
  User,
  Restaurant,
  Category,
  MenuItem,
  Cart,
  Order,
  Delivery,
  Payment,
  Review,
  Notification,
  Coupon
} = require('./models');
```

### Example: Create a Customer
```javascript
const customer = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  password: 'secure123',
  role: 'customer',
  addresses: [{
    label: 'home',
    addressLine1: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    coordinates: {
      type: 'Point',
      coordinates: [72.8777, 19.0760] // [longitude, latitude]
    }
  }]
});
```

### Example: Create a Restaurant
```javascript
const restaurant = await Restaurant.create({
  owner: vendorUserId,
  name: 'Pizza Paradise',
  description: 'Best pizzas in town',
  phone: '9876543210',
  email: 'pizza@example.com',
  address: {
    addressLine1: '456 Food Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400002'
  },
  location: {
    type: 'Point',
    coordinates: [72.8777, 19.0760]
  },
  cuisineTypes: ['Italian', 'Fast Food'],
  priceRange: '₹₹',
  operatingHours: [
    { day: 'Monday', isOpen: true, openTime: '10:00', closeTime: '23:00' },
    // ... other days
  ]
});
```

### Example: Add to Cart
```javascript
const cart = await Cart.findOne({ customer: customerId });

await cart.addItem(restaurantId, {
  menuItem: menuItemId,
  name: 'Margherita Pizza',
  image: 'pizza.jpg',
  price: 299,
  quantity: 2,
  selectedVariants: [
    { name: 'Size', option: 'Large', price: 50 }
  ],
  selectedAddOns: [
    { name: 'Extra Cheese', price: 40 }
  ],
  subtotal: 778 // (299 + 50 + 40) * 2
});
```

### Example: Create an Order
```javascript
const order = await Order.create({
  customer: customerId,
  restaurant: restaurantId,
  items: cartItems,
  deliveryAddress: {
    addressLine1: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    coordinates: {
      type: 'Point',
      coordinates: [72.8777, 19.0760]
    }
  },
  customerPhone: '9876543210',
  pricing: {
    itemsTotal: 778,
    deliveryFee: 40,
    taxAmount: 78,
    totalAmount: 896
  },
  payment: {
    method: 'online',
    status: 'pending'
  },
  estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000) // 45 mins
});
```

## 🔍 Geospatial Queries

### Find Nearby Restaurants
```javascript
const nearbyRestaurants = await Restaurant.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      $maxDistance: 5000 // 5km in meters
    }
  },
  isActive: true,
  isVerified: true
});
```

### Find Available Delivery Partners
```javascript
const availablePartners = await User.find({
  role: 'delivery',
  'deliveryDetails.isAvailable': true,
  'deliveryDetails.currentLocation': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [restaurantLongitude, restaurantLatitude]
      },
      $maxDistance: 3000 // 3km
    }
  }
});
```

## 📊 Aggregation Examples

### Get Top Rated Restaurants
```javascript
const topRestaurants = await Restaurant.find({ isActive: true })
  .sort({ 'rating.average': -1 })
  .limit(10)
  .select('name rating cuisineTypes priceRange');
```

### Get Vendor Revenue Stats
```javascript
const stats = await Order.aggregate([
  {
    $match: {
      restaurant: mongoose.Types.ObjectId(restaurantId),
      status: 'delivered'
    }
  },
  {
    $group: {
      _id: null,
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: '$vendorEarnings' },
      avgOrderValue: { $avg: '$pricing.totalAmount' }
    }
  }
]);
```

## 🔐 Security Features

1. **Password Hashing**: Automatic bcrypt hashing in User schema
2. **Token Management**: Verification and reset tokens with expiry
3. **Geolocation Privacy**: Coordinates stored securely
4. **Payment Security**: Sensitive data in separate Payment schema
5. **Role-Based Access**: Enforced at schema level

## 🚀 Performance Optimization

1. **Indexes**: All schemas have optimized indexes
2. **Geospatial Indexes**: 2dsphere indexes for location queries
3. **Text Indexes**: Full-text search on restaurants and menu items
4. **TTL Indexes**: Auto-deletion of expired data (cart, notifications)
5. **Lean Queries**: Use `.lean()` for read-only operations

## 📱 Real-Time Features Support

All schemas are designed to support WebSocket/Socket.IO integration:
- Order status updates
- Delivery tracking
- Live location updates
- Push notifications

## 🧪 Testing

Example test cases:

```javascript
// Test cart calculations
const cart = new Cart({ customer: userId });
await cart.addItem(restaurantId, itemData);
cart.calculateTotals();
console.assert(cart.summary.totalAmount > 0);

// Test coupon validation
const coupon = await Coupon.findOne({ code: 'SAVE20' });
const validity = coupon.canBeUsedBy(userId, 500);
console.log(validity); // { valid: true } or { valid: false, reason: '...' }
```

## 📄 License

This schema design is part of the T18 Multi-Vendor Food Ordering App project.

## 👥 Team Roles Supported

✅ **Frontend – Customer App**: All customer-facing data models  
✅ **Vendor Dashboard**: Restaurant, Menu, Order management  
✅ **Admin Panel**: User management, system monitoring  
✅ **Backend & API**: Complete REST API support  
✅ **Real-Time System**: Delivery tracking, live updates  

---

**Created for**: Hackathon Sprint Development  
**Database**: MongoDB with Mongoose ODM  
**Version**: 1.0.0
