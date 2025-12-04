# Database Schema - Entity Relationship Diagram

## 📊 Overview

This document describes the complete entity-relationship structure for the T18 Multi-Vendor Food Ordering App.

## 🗃️ Entities & Relationships

### **1. USER** (Central Entity)
```
User {
  _id: ObjectId (PK)
  name: String
  email: String (unique)
  phone: String (unique)
  password: String (hashed)
  role: Enum ['customer', 'vendor', 'delivery', 'admin']
  avatar: String
  addresses: [Address]
  deliveryDetails: Object (for delivery partners)
  isVerified: Boolean
  isActive: Boolean
  fcmToken: String
  createdAt: Date
  updatedAt: Date
}
```

**Relationships:**
- 1:N with Restaurant (as owner)
- 1:1 with Cart
- 1:N with Order (as customer)
- 1:N with Delivery (as delivery partner)
- 1:N with Review (as customer)
- 1:N with Payment (as customer)
- 1:N with Notification (as recipient)

---

### **2. RESTAURANT**
```
Restaurant {
  _id: ObjectId (PK)
  owner: ObjectId (FK → User)
  name: String
  description: String
  logo: String
  banner: String
  phone: String
  email: String
  address: Object
  location: GeoJSON Point
  cuisineTypes: [String]
  priceRange: String
  operatingHours: [Object]
  deliverySettings: Object
  rating: {average: Number, count: Number}
  totalOrders: Number
  revenue: Object
  isOpen: Boolean
  isVerified: Boolean
  isActive: Boolean
  commissionRate: Number
  createdAt: Date
  updatedAt: Date
}
```

**Relationships:**
- N:1 with User (owner)
- 1:N with Category
- 1:N with MenuItem
- 1:N with Order
- 1:N with Review

---

### **3. CATEGORY**
```
Category {
  _id: ObjectId (PK)
  restaurant: ObjectId (FK → Restaurant)
  name: String
  description: String
  displayOrder: Number
  isActive: Boolean
  createdAt: Date
  updatedAt: Date
}
```

**Relationships:**
- N:1 with Restaurant
- 1:N with MenuItem

---

### **4. MENUITEM**
```
MenuItem {
  _id: ObjectId (PK)
  restaurant: ObjectId (FK → Restaurant)
  category: ObjectId (FK → Category)
  name: String
  description: String
  image: String
  price: Number
  originalPrice: Number
  discountPercentage: Number
  foodType: Enum ['Veg', 'Non-Veg', 'Vegan', 'Egg']
  variants: [Object]
  addOns: [Object]
  isAvailable: Boolean
  stockQuantity: Number
  rating: {average: Number, count: Number}
  totalOrders: Number
  preparationTime: Number
  tags: [String]
  isBestseller: Boolean
  createdAt: Date
  updatedAt: Date
}
```

**Relationships:**
- N:1 with Restaurant
- N:1 with Category
- 1:N with Review

---

### **5. CART**
```
Cart {
  _id: ObjectId (PK)
  customer: ObjectId (FK → User) (unique)
  restaurants: [
    {
      restaurant: ObjectId (FK → Restaurant)
      items: [CartItem]
      subtotal: Number
      deliveryFee: Number
      specialInstructions: String
    }
  ]
  summary: {
    totalItems: Number
    itemsTotal: Number
    totalDeliveryFee: Number
    totalAmount: Number
  }
  appliedCoupon: Object
  expiresAt: Date (TTL index)
  createdAt: Date
  updatedAt: Date
}

CartItem {
  menuItem: ObjectId (FK → MenuItem)
  name: String
  image: String
  price: Number
  quantity: Number
  selectedVariants: [Object]
  selectedAddOns: [Object]
  instructions: String
  subtotal: Number
  addedAt: Date
}
```

**Relationships:**
- 1:1 with User (customer)
- N:N with MenuItem (through cart items)

---

### **6. ORDER**
```
Order {
  _id: ObjectId (PK)
  orderNumber: String (unique)
  customer: ObjectId (FK → User)
  restaurant: ObjectId (FK → Restaurant)
  subOrders: [
    {
      restaurant: ObjectId (FK → Restaurant)
      items: [OrderItem]
      subtotal: Number
      vendorStatus: String
      rejectionReason: String
    }
  ]
  items: [OrderItem]
  deliveryAddress: Object (with GeoJSON)
  customerPhone: String
  deliveryPartner: ObjectId (FK → User)
  pricing: {
    itemsTotal: Number
    deliveryFee: Number
    taxAmount: Number
    discount: Number
    totalAmount: Number
  }
  payment: {
    method: String
    status: String
    transactionId: String
  }
  status: Enum [many statuses]
  statusHistory: [Object]
  estimatedDeliveryTime: Date
  commission: Object
  vendorEarnings: Number
  deliveryEarnings: Number
  isSettled: Boolean
  createdAt: Date
  updatedAt: Date
}
```

**Relationships:**
- N:1 with User (customer)
- N:1 with Restaurant
- N:1 with User (delivery partner)
- 1:1 with Delivery
- 1:1 with Payment
- 1:N with Review

---

### **7. DELIVERY**
```
Delivery {
  _id: ObjectId (PK)
  order: ObjectId (FK → Order) (unique)
  deliveryPartner: ObjectId (FK → User)
  assignmentStatus: Enum
  status: Enum
  pickupLocation: {
    restaurant: ObjectId (FK → Restaurant)
    address: Object
    coordinates: GeoJSON Point
  }
  dropLocation: {
    address: Object
    coordinates: GeoJSON Point
  }
  distance: Number
  currentLocation: GeoJSON Point
  locationHistory: [Object]
  assignedAt: Date
  pickedUpAt: Date
  deliveredAt: Date
  deliveryProof: Object
  deliveryFee: Number
  tip: Number
  totalEarnings: Number
  rating: Object
  createdAt: Date
  updatedAt: Date
}
```

**Relationships:**
- 1:1 with Order
- N:1 with User (delivery partner)
- N:1 with Restaurant (pickup)
- 1:N with Review

---

### **8. PAYMENT**
```
Payment {
  _id: ObjectId (PK)
  transactionId: String (unique)
  gatewayOrderId: String
  order: ObjectId (FK → Order)
  customer: ObjectId (FK → User)
  gateway: Enum ['razorpay', 'stripe', 'paytm', etc.]
  method: Enum ['card', 'upi', 'netbanking', etc.]
  amount: Number
  currency: String
  status: Enum
  refund: Object
  gatewayResponse: Mixed
  isSettled: Boolean
  gatewayFees: Number
  netAmount: Number
  createdAt: Date
  updatedAt: Date
}
```

**Relationships:**
- 1:1 with Order
- N:1 with User (customer)

---

### **9. REVIEW**
```
Review {
  _id: ObjectId (PK)
  reviewType: Enum ['restaurant', 'delivery', 'menuItem']
  customer: ObjectId (FK → User)
  order: ObjectId (FK → Order)
  restaurant: ObjectId (FK → Restaurant) (optional)
  menuItem: ObjectId (FK → MenuItem) (optional)
  deliveryPartner: ObjectId (FK → User) (optional)
  rating: Number (1-5)
  comment: String
  detailedRatings: Object
  images: [String]
  helpfulCount: Number
  response: Object
  isVisible: Boolean
  createdAt: Date
  updatedAt: Date
}
```

**Relationships:**
- N:1 with User (customer)
- N:1 with Order
- N:1 with Restaurant (optional)
- N:1 with MenuItem (optional)
- N:1 with User (delivery partner, optional)

---

### **10. NOTIFICATION**
```
Notification {
  _id: ObjectId (PK)
  recipient: ObjectId (FK → User)
  type: Enum (many types)
  title: String
  message: String
  image: String
  actionUrl: String
  relatedOrder: ObjectId (FK → Order)
  relatedRestaurant: ObjectId (FK → Restaurant)
  isRead: Boolean
  readAt: Date
  deliveryStatus: Object
  priority: Enum
  isSent: Boolean
  expiresAt: Date (TTL index)
  createdAt: Date
  updatedAt: Date
}
```

**Relationships:**
- N:1 with User (recipient)
- N:1 with Order (optional)
- N:1 with Restaurant (optional)

---

### **11. COUPON**
```
Coupon {
  _id: ObjectId (PK)
  code: String (unique)
  title: String
  description: String
  discountType: Enum ['percentage', 'flat', 'free_delivery']
  discountValue: Number
  maxDiscountAmount: Number
  minOrderAmount: Number
  validFrom: Date
  validUntil: Date
  maxUsageCount: Number
  currentUsageCount: Number
  maxUsagePerUser: Number
  applicableTo: Enum
  applicableRestaurants: [ObjectId → Restaurant]
  applicableUsers: [ObjectId → User]
  isActive: Boolean
  createdBy: ObjectId (FK → User)
  usedBy: [Object]
  createdAt: Date
  updatedAt: Date
}
```

**Relationships:**
- N:1 with User (creator)
- N:N with Restaurant (applicable restaurants)
- N:N with User (applicable users)

---

## 🔗 Relationship Summary

### One-to-One (1:1)
- User ↔ Cart
- Order ↔ Delivery
- Order ↔ Payment

### One-to-Many (1:N)
- User → Restaurant (as owner)
- User → Order (as customer)
- User → Delivery (as delivery partner)
- User → Review (as customer)
- User → Notification (as recipient)
- Restaurant → Category
- Restaurant → MenuItem
- Restaurant → Order
- Restaurant → Review
- Category → MenuItem
- Order → Review

### Many-to-Many (N:N)
- Cart ↔ MenuItem (through cart items)
- Coupon ↔ Restaurant (applicable restaurants)
- Coupon ↔ User (applicable users)

---

## 📍 Geospatial Indexes

Entities with 2dsphere indexes for location-based queries:

1. **User** → `deliveryDetails.currentLocation`
2. **User** → `addresses.coordinates`
3. **Restaurant** → `location`
4. **Order** → `deliveryAddress.coordinates`
5. **Delivery** → `pickupLocation.coordinates`
6. **Delivery** → `dropLocation.coordinates`
7. **Delivery** → `currentLocation`

---

## 📑 Key Indexes

### Performance Optimization Indexes:
- Text indexes: Restaurant (name, description), MenuItem (name, description)
- Compound indexes: Restaurant (isActive, isVerified, isOpen)
- Unique indexes: User (email, phone), Order (orderNumber), Payment (transactionId)
- TTL indexes: Cart (expiresAt), Notification (expiresAt)

---

## 🔄 Data Flow

### Order Placement Flow:
```
Customer → Cart → Order → Payment → Delivery → Review
     ↓        ↓       ↓        ↓         ↓         ↓
   User   MenuItem Restaurant Notification Tracking Rating
```

### Multi-Vendor Order Flow:
```
Cart (Multi-Restaurant Items)
        ↓
Order (with SubOrders)
        ↓
Multiple Restaurants (Accept/Reject)
        ↓
Delivery Assignment
        ↓
Real-time Tracking
        ↓
Completion & Reviews
```

---

## 📊 Aggregation Pipelines

### Common Queries:

1. **Top Rated Restaurants**
```javascript
Restaurant.aggregate([
  { $match: { isActive: true } },
  { $sort: { 'rating.average': -1 } },
  { $limit: 10 }
])
```

2. **Vendor Revenue Report**
```javascript
Order.aggregate([
  { $match: { restaurant: restaurantId, status: 'delivered' } },
  { $group: {
      _id: null,
      totalRevenue: { $sum: '$vendorEarnings' },
      totalOrders: { $sum: 1 }
    }
  }
])
```

3. **Delivery Partner Earnings**
```javascript
Delivery.aggregate([
  { $match: { deliveryPartner: userId, status: 'delivered' } },
  { $group: { _id: null, totalEarnings: { $sum: '$totalEarnings' } } }
])
```

---

## 🎯 Sprint Implementation Priority

### Day 1: Core Schemas
✅ User, Restaurant, MenuItem, Category

### Day 2: Transaction Schemas
✅ Cart, Order, Payment

### Day 3: Operations Schemas
✅ Delivery, Notification, Review

### Day 4: Enhancement Schemas
✅ Coupon, Analytics (future)

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Database**: MongoDB 6.x+  
**ODM**: Mongoose 8.x+
