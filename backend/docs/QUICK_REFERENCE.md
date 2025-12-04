# ⚡ Quick Reference Guide

## 🎯 Common Operations

### User Operations

```javascript
// Register new customer
const customer = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  password: 'password123',
  role: 'customer'
});

// Login
const user = await User.findOne({ email }).select('+password');
const isMatch = await user.comparePassword(password);

// Add address
user.addresses.push({
  label: 'home',
  addressLine1: '123 Main St',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  coordinates: { type: 'Point', coordinates: [72.8777, 19.0760] }
});
await user.save();
```

### Restaurant Operations

```javascript
// Create restaurant
const restaurant = await Restaurant.create({
  owner: vendorUserId,
  name: 'Pizza Paradise',
  description: 'Best pizzas in town',
  phone: '9876543210',
  email: 'pizza@example.com',
  address: { /* ... */ },
  location: { type: 'Point', coordinates: [lng, lat] },
  cuisineTypes: ['Italian', 'Fast Food'],
  priceRange: '₹₹'
});

// Find nearby restaurants
const nearby = await Restaurant.find({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [lng, lat] },
      $maxDistance: 5000 // 5km in meters
    }
  },
  isActive: true,
  isVerified: true
});

// Check if currently open
const isOpen = restaurant.isCurrentlyOpen();
```

### Menu Operations

```javascript
// Create category
const category = await Category.create({
  restaurant: restaurantId,
  name: 'Pizzas',
  description: 'Wood-fired pizzas',
  displayOrder: 1
});

// Create menu item
const item = await MenuItem.create({
  restaurant: restaurantId,
  category: categoryId,
  name: 'Margherita Pizza',
  description: 'Classic pizza with mozzarella',
  price: 299,
  foodType: 'Veg',
  variants: [
    {
      name: 'Size',
      options: [
        { label: 'Regular', price: 0 },
        { label: 'Large', price: 50 }
      ],
      isRequired: true
    }
  ],
  addOns: [
    { name: 'Extra Cheese', price: 40, isAvailable: true }
  ],
  isAvailable: true
});

// Check availability
const isAvailable = item.isAvailableNow();

// Get final price with discount
const finalPrice = item.getFinalPrice();
```

### Cart Operations

```javascript
// Get or create cart
let cart = await Cart.findOne({ customer: userId });
if (!cart) {
  cart = await Cart.create({ customer: userId });
}

// Add item to cart
await cart.addItem(restaurantId, {
  menuItem: itemId,
  name: 'Margherita Pizza',
  image: 'pizza.jpg',
  price: 299,
  quantity: 2,
  selectedVariants: [
    { name: 'Size', option: 'Large', price: 50 }
  ],
  selectedAddOns: [
    { name: 'Extra Cheese', price: 40 }
  ]
});

// Update quantity
await cart.updateItemQuantity(restaurantId, itemId, 3);

// Remove item
await cart.removeItem(restaurantId, itemId);

// Clear cart
await cart.clearCart();

// Get totals
cart.calculateTotals();
console.log(cart.summary);
```

### Order Operations

```javascript
// Create order
const order = await Order.create({
  customer: customerId,
  restaurant: restaurantId,
  items: cartItems,
  deliveryAddress: {
    addressLine1: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    coordinates: { type: 'Point', coordinates: [lng, lat] }
  },
  customerPhone: '9876543210',
  pricing: {
    itemsTotal: 778,
    deliveryFee: 40,
    taxAmount: 78,
    totalAmount: 896
  },
  payment: { method: 'online', status: 'pending' },
  estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000)
});

// Update order status
order.status = 'confirmed';
await order.save();

// Calculate vendor earnings
order.calculateVendorEarnings();

// Check if can be cancelled
const canCancel = order.canBeCancelled();

// Get orders by customer
const orders = await Order.find({ customer: userId })
  .sort({ createdAt: -1 })
  .populate('restaurant', 'name logo')
  .limit(10);
```

### Delivery Operations

```javascript
// Create delivery
const delivery = await Delivery.create({
  order: orderId,
  pickupLocation: {
    restaurant: restaurantId,
    coordinates: { type: 'Point', coordinates: [lng, lat] }
  },
  dropLocation: {
    address: orderAddress,
    coordinates: { type: 'Point', coordinates: [lng, lat] }
  },
  distance: 5.2,
  estimatedDuration: 30
});

// Assign delivery partner
delivery.deliveryPartner = deliveryPartnerId;
delivery.assignmentStatus = 'assigned';
delivery.status = 'assigned';
await delivery.save();

// Update location
delivery.updateLocation(latitude, longitude, speed, accuracy);
await delivery.save();

// Mark as picked up
delivery.markAsPickedUp();
await delivery.save();

// Mark as delivered
delivery.markAsDelivered({
  photo: 'proof.jpg',
  otp: '1234'
});
await delivery.save();
```

### Payment Operations

```javascript
// Create payment
const payment = await Payment.create({
  transactionId: 'TXN123456',
  gatewayOrderId: 'order_ABC123',
  order: orderId,
  customer: customerId,
  gateway: 'razorpay',
  method: 'upi',
  amount: 896,
  status: 'initiated'
});

// Mark as success
payment.markAsSuccess({ razorpay_payment_id: 'pay_123' });
await payment.save();

// Mark as failed
payment.markAsFailed('PAYMENT_FAILED', 'Insufficient funds');
await payment.save();

// Initiate refund
payment.initiateRefund(896, 'customer_request');
await payment.save();

// Complete refund
payment.completeRefund('rfnd_123456');
await payment.save();
```

### Review Operations

```javascript
// Create restaurant review
const review = await Review.create({
  reviewType: 'restaurant',
  customer: customerId,
  order: orderId,
  restaurant: restaurantId,
  rating: 5,
  comment: 'Excellent food and service!',
  detailedRatings: {
    food: 5,
    service: 5,
    packaging: 4,
    valueForMoney: 5
  },
  images: ['review1.jpg']
});

// Mark as helpful
review.markAsHelpful(userId);
await review.save();

// Add vendor response
review.addResponse('Thank you for your feedback!', vendorId);
await review.save();

// Get average rating
const stats = await Review.getRestaurantAverageRating(restaurantId);
console.log(stats); // { averageRating: 4.6, count: 247 }
```

### Coupon Operations

```javascript
// Create coupon
const coupon = await Coupon.create({
  code: 'SAVE20',
  title: 'Save 20% on your order',
  description: 'Get flat 20% off on orders above ₹500',
  discountType: 'percentage',
  discountValue: 20,
  maxDiscountAmount: 200,
  minOrderAmount: 500,
  validFrom: new Date(),
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  maxUsageCount: 1000,
  maxUsagePerUser: 1,
  applicableTo: 'all',
  isActive: true,
  createdBy: adminId
});

// Validate coupon
const validation = coupon.canBeUsedBy(userId, orderAmount);
if (validation.valid) {
  const discount = coupon.calculateDiscount(orderAmount);
  console.log(`Discount: ₹${discount}`);
}

// Apply coupon
coupon.applyCoupon(userId, orderId, discountAmount);
await coupon.save();
```

### Notification Operations

```javascript
// Create notification
const notification = await Notification.create({
  recipient: userId,
  type: 'order_confirmed',
  title: 'Order Confirmed!',
  message: 'Your order has been confirmed by the restaurant',
  relatedOrder: orderId,
  priority: 'high'
});

// Mark as sent
notification.markAsSent('push');
await notification.save();

// Mark as read
notification.markAsRead();
await notification.save();

// Get unread count
const unreadCount = await Notification.getUnreadCount(userId);

// Mark all as read
await Notification.markAllAsRead(userId);
```

---

## 📊 Advanced Queries

### Aggregation Examples

```javascript
// Top restaurants by orders
const topRestaurants = await Restaurant.aggregate([
  { $match: { isActive: true } },
  { $sort: { totalOrders: -1 } },
  { $limit: 10 },
  { $project: { name: 1, totalOrders: 1, 'rating.average': 1 } }
]);

// Vendor revenue by month
const revenue = await Order.aggregate([
  {
    $match: {
      restaurant: restaurantId,
      status: 'delivered',
      createdAt: { $gte: new Date('2025-01-01') }
    }
  },
  {
    $group: {
      _id: { $month: '$createdAt' },
      totalRevenue: { $sum: '$vendorEarnings' },
      orderCount: { $sum: 1 },
      avgOrderValue: { $avg: '$pricing.totalAmount' }
    }
  },
  { $sort: { _id: 1 } }
]);

// Delivery partner performance
const performance = await Delivery.aggregate([
  {
    $match: {
      deliveryPartner: partnerId,
      status: 'delivered'
    }
  },
  {
    $group: {
      _id: null,
      totalDeliveries: { $sum: 1 },
      totalEarnings: { $sum: '$totalEarnings' },
      avgRating: { $avg: '$rating.score' },
      avgDuration: { $avg: '$actualDuration' }
    }
  }
]);

// Popular menu items
const popular = await Order.aggregate([
  { $unwind: '$items' },
  {
    $group: {
      _id: '$items.menuItem',
      name: { $first: '$items.name' },
      totalOrders: { $sum: '$items.quantity' },
      revenue: { $sum: '$items.subtotal' }
    }
  },
  { $sort: { totalOrders: -1 } },
  { $limit: 10 }
]);
```

### Geospatial Queries

```javascript
// Find restaurants within radius
const restaurants = await Restaurant.find({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [lng, lat] },
      $maxDistance: 5000 // meters
    }
  }
});

// Find delivery partners near restaurant
const partners = await User.find({
  role: 'delivery',
  'deliveryDetails.isAvailable': true,
  'deliveryDetails.currentLocation': {
    $near: {
      $geometry: { type: 'Point', coordinates: [lng, lat] },
      $maxDistance: 3000
    }
  }
}).limit(5);

// Calculate distance between two points
const distance = await Restaurant.aggregate([
  {
    $geoNear: {
      near: { type: 'Point', coordinates: [lng, lat] },
      distanceField: 'distance',
      maxDistance: 10000,
      spherical: true
    }
  }
]);
```

---

## 🔍 Search & Filter

```javascript
// Text search restaurants
const results = await Restaurant.find({
  $text: { $search: 'pizza burger italian' }
}).sort({ score: { $meta: 'textScore' } });

// Filter restaurants
const filtered = await Restaurant.find({
  isActive: true,
  isVerified: true,
  cuisineTypes: { $in: ['Italian', 'Chinese'] },
  'rating.average': { $gte: 4.0 },
  priceRange: { $in: ['₹', '₹₹'] }
});

// Search menu items
const menuItems = await MenuItem.find({
  restaurant: restaurantId,
  $or: [
    { name: { $regex: searchTerm, $options: 'i' } },
    { description: { $regex: searchTerm, $options: 'i' } }
  ],
  isAvailable: true
});
```

---

## 🎓 Tips & Best Practices

### Performance
- Use `.lean()` for read-only queries
- Index frequently queried fields
- Use projections to limit returned fields
- Implement pagination for large datasets

### Security
- Never send passwords in responses (use `select: false`)
- Validate all inputs
- Use JWT for authentication
- Implement rate limiting

### Data Integrity
- Use transactions for multi-document operations
- Implement proper error handling
- Validate before saving
- Use schema validation

### Real-time Updates
- Emit Socket.IO events on status changes
- Update cache when data changes
- Use Redis for session management
- Implement optimistic UI updates

---

## 📞 Quick Commands

```bash
# Start MongoDB locally
mongod

# Connect to MongoDB shell
mongosh

# Import sample data
mongoimport --db food_ordering_app --collection restaurants --file data.json

# Export data
mongoexport --db food_ordering_app --collection orders --out orders.json

# Create database backup
mongodump --db food_ordering_app --out ./backup

# Restore database
mongorestore --db food_ordering_app ./backup/food_ordering_app
```

---

**Ready to Build! 🚀**
