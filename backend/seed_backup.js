const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Coupon = require('./models/Coupon');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI)
  .then(() => console.log('✓ MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Demo users (customers, vendors, delivery partners)
const demoUsers = [
  // Customers
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$X5w7w8e5F7w8e5F7w8e5FuO5F7w8e5F7w8e5F7w8e5F7w8e5F7w8e', // password: customer123
    phone: '9876543210',
    role: 'customer',
    addresses: [{
      label: 'home',
      addressLine1: '123 MG Road',
      addressLine2: 'Near Central Mall',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true
    }]
  },
  {
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    password: '$2a$10$X5w7w8e5F7w8e5F7w8e5FuO5F7w8e5F7w8e5F7w8e5F7w8e5F7w8e',
    phone: '9876543211',
    role: 'customer',
    addresses: [{
      label: 'work',
      addressLine1: '456 Brigade Road',
      addressLine2: 'Tech Park Building B',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560025',
      isDefault: true
    }]
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: '$2a$10$X5w7w8e5F7w8e5F7w8e5FuO5F7w8e5F7w8e5F7w8e5F7w8e5F7w8e',
    phone: '9876543212',
    role: 'customer',
    addresses: [{
      label: 'home',
      addressLine1: '789 Koramangala',
      addressLine2: '5th Block',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      isDefault: true
    }]
  },
  // Vendors
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@vendor.com',
    password: '$2a$10$X5w7w8e5F7w8e5F7w8e5FuO5F7w8e5F7w8e5F7w8e5F7w8e5F7w8e', // password: vendor123
    phone: '9876543220',
    role: 'vendor'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@vendor.com',
    password: '$2a$10$X5w7w8e5F7w8e5F7w8e5FuO5F7w8e5F7w8e5F7w8e5F7w8e5F7w8e',
    phone: '9876543221',
    role: 'vendor'
  },
  {
    name: 'Ahmed Khan',
    email: 'ahmed@vendor.com',
    password: '$2a$10$X5w7w8e5F7w8e5F7w8e5FuO5F7w8e5F7w8e5F7w8e5F7w8e5F7w8e',
    phone: '9876543222',
    role: 'vendor'
  },
  {
    name: 'David Lee',
    email: 'david@vendor.com',
    password: '$2a$10$X5w7w8e5F7w8e5F7w8e5FuO5F7w8e5F7w8e5F7w8e5F7w8e5F7w8e',
    phone: '9876543223',
    role: 'vendor'
  },
  {
    name: 'Maria Garcia',
    email: 'maria@vendor.com',
    password: '$2a$10$X5w7w8e5F7w8e5F7w8e5FuO5F7w8e5F7w8e5F7w8e5F7w8e5F7w8e',
    phone: '9876543224',
    role: 'vendor'
  },
  // Delivery Partners
  {
    name: 'Ravi Delivery',
    email: 'ravi@delivery.com',
    password: '$2a$10$X5w7w8e5F7w8e5F7w8e5FuO5F7w8e5F7w8e5F7w8e5F7w8e5F7w8e', // password: delivery123
    phone: '9876543230',
    role: 'delivery',
    deliveryDetails: {
      vehicleType: 'bike',
      vehicleNumber: 'KA01AB1234',
      isAvailable: true,
      currentLocation: {
        type: 'Point',
        coordinates: [77.5946, 12.9716] // [longitude, latitude]
      }
    }
  },
  {
    name: 'Amit Delivery',
    email: 'amit@delivery.com',
    password: '$2a$10$X5w7w8e5F7w8e5F7w8e5FuO5F7w8e5F7w8e5F7w8e5F7w8e5F7w8e',
    phone: '9876543231',
    role: 'delivery',
    deliveryDetails: {
      vehicleType: 'bike',
      vehicleNumber: 'KA01CD5678',
      isAvailable: true,
      currentLocation: {
        type: 'Point',
        coordinates: [77.6245, 12.9352] // [longitude, latitude]
      }
    }
  },
  {
    name: 'Suresh Delivery',
    email: 'suresh@delivery.com',
    password: '$2a$10$X5w7w8e5F7w8e5F7w8e5FuO5F7w8e5F7w8e5F7w8e5F7w8e5F7w8e',
    phone: '9876543232',
    role: 'delivery',
    deliveryDetails: {
      vehicleType: 'scooter',
      vehicleNumber: 'KA01EF9012',
      isAvailable: true,
      currentLocation: {
        type: 'Point',
        coordinates: [77.6025, 12.9698] // [longitude, latitude]
      }
    }
  }
];

// Demo restaurants
const demoRestaurants = [
  {
    name: 'Spice Garden',
    description: 'Authentic Indian cuisine with traditional flavors and aromatic spices. Experience the taste of India with our carefully curated menu featuring North Indian specialties.',
    email: 'spicegarden@restaurant.com',
    phone: '9876543220',
    address: {
      addressLine1: '45 Residency Road',
      addressLine2: 'Near Central Metro Station',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560025',
      landmark: 'Opposite City Mall'
    },
    location: {
      type: 'Point',
      coordinates: [77.5946, 12.9716] // [longitude, latitude]
    },
    cuisineTypes: ['Indian', 'North Indian'],
    foodTypes: ['Veg', 'Non-Veg'],
    priceRange: '₹₹',
    operatingHours: [
      { day: 'Monday', openTime: '10:00', closeTime: '23:00', isOpen: true },
      { day: 'Tuesday', openTime: '10:00', closeTime: '23:00', isOpen: true },
      { day: 'Wednesday', openTime: '10:00', closeTime: '23:00', isOpen: true },
      { day: 'Thursday', openTime: '10:00', closeTime: '23:00', isOpen: true },
      { day: 'Friday', openTime: '10:00', closeTime: '23:00', isOpen: true },
      { day: 'Saturday', openTime: '10:00', closeTime: '23:00', isOpen: true },
      { day: 'Sunday', openTime: '10:00', closeTime: '23:00', isOpen: true }
    ],
    deliverySettings: {
      isDeliveryAvailable: true,
      deliveryRadius: 10,
      minOrderAmount: 100,
      deliveryFee: 40,
      deliveryTime: '30-40 mins',
      freeDeliveryAbove: 500
    },
    isActive: true,
    isVerified: true,
    isOpen: true,
    features: ['Home Delivery', 'Takeaway', 'Cards Accepted', 'Wallet Accepted'],
    tags: ['Popular', 'Indian', 'Curry']
  },
  {
    name: 'Pizza Paradise',
    description: 'Wood-fired authentic Italian pizzas made with fresh ingredients imported from Italy. Experience the true taste of Naples in every bite.',
    email: 'pizzaparadise@restaurant.com',
    phone: '9876543221',
    address: {
      addressLine1: '78 Indiranagar 100 Feet Road',
      addressLine2: 'CMH Road Junction',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      landmark: 'Next to HDFC Bank'
    },
    location: {
      type: 'Point',
      coordinates: [77.6408, 12.9784] // [longitude, latitude]
    },
    cuisineTypes: ['Italian', 'Continental', 'Fast Food'],
    foodTypes: ['Veg', 'Non-Veg'],
    priceRange: '₹₹₹',
    operatingHours: [
      { day: 'Monday', openTime: '11:00', closeTime: '23:00', isOpen: true },
      { day: 'Tuesday', openTime: '11:00', closeTime: '23:00', isOpen: true },
      { day: 'Wednesday', openTime: '11:00', closeTime: '23:00', isOpen: true },
      { day: 'Thursday', openTime: '11:00', closeTime: '23:00', isOpen: true },
      { day: 'Friday', openTime: '11:00', closeTime: '00:00', isOpen: true },
      { day: 'Saturday', openTime: '11:00', closeTime: '00:00', isOpen: true },
      { day: 'Sunday', openTime: '11:00', closeTime: '23:00', isOpen: true }
    ],
    deliverySettings: {
      isDeliveryAvailable: true,
      deliveryRadius: 8,
      minOrderAmount: 150,
      deliveryFee: 50,
      deliveryTime: '35-45 mins',
      freeDeliveryAbove: 600
    },
    isActive: true,
    isVerified: true,
    isOpen: true,
    isFeatured: true,
    features: ['Home Delivery', 'Outdoor Seating', 'Cards Accepted', 'Wallet Accepted', 'Parking Available'],
    tags: ['Pizza', 'Italian', 'Wood-fired']
  },
  {
    name: 'Biryani House',
    description: 'Authentic Hyderabadi biryani crafted with age-old recipes and the finest basmati rice. A paradise for biryani lovers with flavors that transport you to Hyderabad.',
    email: 'biryanihouse@restaurant.com',
    phone: '9876543222',
    address: {
      addressLine1: '23 HSR Layout Sector 1',
      addressLine2: '27th Main Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560102',
      landmark: 'Near BDA Complex'
    },
    location: {
      type: 'Point',
      coordinates: [77.6476, 12.9082] // [longitude, latitude]
    },
    cuisineTypes: ['Indian', 'North Indian'],
    foodTypes: ['Veg', 'Non-Veg'],
    priceRange: '₹₹',
    operatingHours: [
      { day: 'Monday', openTime: '11:00', closeTime: '22:30', isOpen: true },
      { day: 'Tuesday', openTime: '11:00', closeTime: '22:30', isOpen: true },
      { day: 'Wednesday', openTime: '11:00', closeTime: '22:30', isOpen: true },
      { day: 'Thursday', openTime: '11:00', closeTime: '22:30', isOpen: true },
      { day: 'Friday', openTime: '11:00', closeTime: '23:00', isOpen: true },
      { day: 'Saturday', openTime: '11:00', closeTime: '23:00', isOpen: true },
      { day: 'Sunday', openTime: '11:00', closeTime: '23:00', isOpen: true }
    ],
    deliverySettings: {
      isDeliveryAvailable: true,
      deliveryRadius: 12,
      minOrderAmount: 120,
      deliveryFee: 35,
      deliveryTime: '40-50 mins',
      freeDeliveryAbove: 400
    },
    isActive: true,
    isVerified: true,
    isOpen: true,
    features: ['Home Delivery', 'Takeaway', 'Cards Accepted', 'Wallet Accepted'],
    tags: ['Biryani', 'Hyderabadi', 'Authentic']
  },
  {
    name: 'Burger Hub',
    description: 'Gourmet burgers and American classics made with premium ingredients. Juicy patties, fresh veggies, and signature sauces in every bite.',
    email: 'burgerhub@restaurant.com',
    phone: '9876543223',
    address: {
      addressLine1: '56 Whitefield Main Road',
      addressLine2: 'ITPL Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      landmark: 'Near Forum Mall'
    },
    location: {
      type: 'Point',
      coordinates: [77.7499, 12.9698] // [longitude, latitude]
    },
    cuisineTypes: ['American', 'Fast Food'],
    foodTypes: ['Veg', 'Non-Veg'],
    priceRange: '₹₹',
    operatingHours: [
      { day: 'Monday', openTime: '11:00', closeTime: '23:00', isOpen: true },
      { day: 'Tuesday', openTime: '11:00', closeTime: '23:00', isOpen: true },
      { day: 'Wednesday', openTime: '11:00', closeTime: '23:00', isOpen: true },
      { day: 'Thursday', openTime: '11:00', closeTime: '23:00', isOpen: true },
      { day: 'Friday', openTime: '11:00', closeTime: '00:00', isOpen: true },
      { day: 'Saturday', openTime: '11:00', closeTime: '00:00', isOpen: true },
      { day: 'Sunday', openTime: '11:00', closeTime: '23:00', isOpen: true }
    ],
    deliverySettings: {
      isDeliveryAvailable: true,
      deliveryRadius: 7,
      minOrderAmount: 100,
      deliveryFee: 45,
      deliveryTime: '25-35 mins',
      freeDeliveryAbove: 450
    },
    isActive: true,
    isVerified: true,
    isOpen: true,
    features: ['Home Delivery', 'Takeaway', 'Cards Accepted', 'Wallet Accepted', 'Parking Available'],
    tags: ['Burgers', 'Fast Food', 'American']
  },
  {
    name: 'Chinese Wok',
    description: 'Authentic Chinese cuisine and Asian fusion dishes prepared by expert chefs. From Szechuan to Cantonese, experience the diverse flavors of China.',
    email: 'chinesewok@restaurant.com',
    phone: '9876543224',
    address: {
      addressLine1: '34 Marathahalli Bridge',
      addressLine2: 'Outer Ring Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560037',
      landmark: 'Near Innovative Multiplex'
    },
    location: {
      type: 'Point',
      coordinates: [77.6974, 12.9591] // [longitude, latitude]
    },
    cuisineTypes: ['Chinese', 'Thai'],
    foodTypes: ['Veg', 'Non-Veg'],
    priceRange: '₹₹',
    operatingHours: [
      { day: 'Monday', openTime: '11:30', closeTime: '22:30', isOpen: true },
      { day: 'Tuesday', openTime: '11:30', closeTime: '22:30', isOpen: true },
      { day: 'Wednesday', openTime: '11:30', closeTime: '22:30', isOpen: true },
      { day: 'Thursday', openTime: '11:30', closeTime: '22:30', isOpen: true },
      { day: 'Friday', openTime: '11:30', closeTime: '23:00', isOpen: true },
      { day: 'Saturday', openTime: '11:30', closeTime: '23:00', isOpen: true },
      { day: 'Sunday', openTime: '11:30', closeTime: '23:00', isOpen: true }
    ],
    deliverySettings: {
      isDeliveryAvailable: true,
      deliveryRadius: 9,
      minOrderAmount: 150,
      deliveryFee: 40,
      deliveryTime: '30-40 mins',
      freeDeliveryAbove: 500
    },
    isActive: true,
    isVerified: true,
    isOpen: true,
    features: ['Home Delivery', 'Takeaway', 'Pure Veg', 'Cards Accepted', 'Wallet Accepted'],
    tags: ['Chinese', 'Noodles', 'Asian']
  }
];


// Demo menu items for each restaurant
const getMenuItems = (restaurantId, categoryMap, restaurantName) => {
  const menus = {
    'Spice Garden': [
      { name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken', price: 280, categoryName: 'Main Course', foodType: 'Non-Veg', isAvailable: true, preparationTime: 25, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398' },
      { name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese in rich gravy', price: 240, categoryName: 'Main Course', foodType: 'Veg', isAvailable: true, preparationTime: 20, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8' },
      { name: 'Tandoori Chicken', description: 'Marinated chicken grilled in tandoor', price: 320, categoryName: 'Starters', foodType: 'Non-Veg', isAvailable: true, preparationTime: 30, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0' },
      { name: 'Dal Makhani', description: 'Black lentils cooked overnight with butter', price: 180, categoryName: 'Main Course', foodType: 'Veg', isAvailable: true, preparationTime: 15, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6' },
      { name: 'Garlic Naan', description: 'Fresh naan bread topped with garlic', price: 60, categoryName: 'Breads', foodType: 'Veg', isAvailable: true, preparationTime: 10, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950' },
      { name: 'Biryani', description: 'Fragrant basmati rice with spices and meat', price: 300, categoryName: 'Rice', foodType: 'Non-Veg', isAvailable: true, preparationTime: 35, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8' }
    ],
    'Pizza Paradise': [
      { name: 'Margherita Pizza', description: 'Classic tomato, mozzarella, and basil', price: 250, categoryName: 'Pizza', foodType: 'Veg', isAvailable: true, preparationTime: 20, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca' },
      { name: 'Pepperoni Pizza', description: 'Loaded with spicy pepperoni slices', price: 320, categoryName: 'Pizza', foodType: 'Non-Veg', isAvailable: true, preparationTime: 20, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e' },
      { name: 'Veggie Supreme', description: 'Bell peppers, olives, onions, mushrooms', price: 280, categoryName: 'Pizza', foodType: 'Veg', isAvailable: true, preparationTime: 20, image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f' },
      { name: 'Chicken BBQ Pizza', description: 'BBQ chicken with onions and cilantro', price: 340, categoryName: 'Pizza', foodType: 'Non-Veg', isAvailable: true, preparationTime: 25, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38' },
      { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 120, categoryName: 'Sides', foodType: 'Veg', isAvailable: true, preparationTime: 10, image: 'https://images.unsplash.com/photo-1573140401552-388e259b8f4f' },
      { name: 'Caesar Salad', description: 'Romaine lettuce with Caesar dressing', price: 150, categoryName: 'Salads', foodType: 'Veg', isAvailable: true, preparationTime: 10, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1' }
    ],
    'Biryani House': [
      { name: 'Hyderabadi Chicken Biryani', description: 'Authentic Hyderabadi-style chicken biryani', price: 280, categoryName: 'Biryani', foodType: 'Non-Veg', isAvailable: true, preparationTime: 40, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8' },
      { name: 'Mutton Biryani', description: 'Tender mutton with aromatic rice', price: 350, categoryName: 'Biryani', foodType: 'Non-Veg', isAvailable: true, preparationTime: 45, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0' },
      { name: 'Veg Dum Biryani', description: 'Layered vegetable biryani', price: 220, categoryName: 'Biryani', foodType: 'Veg', isAvailable: true, preparationTime: 35, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b' },
      { name: 'Raita', description: 'Yogurt with cucumber and spices', price: 60, categoryName: 'Sides', foodType: 'Veg', isAvailable: true, preparationTime: 5, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84' },
      { name: 'Mirchi Ka Salan', description: 'Spicy pepper curry', price: 120, categoryName: 'Curry', foodType: 'Veg', isAvailable: true, preparationTime: 15, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe' },
      { name: 'Double Ka Meetha', description: 'Bread pudding dessert', price: 100, categoryName: 'Desserts', foodType: 'Veg', isAvailable: true, preparationTime: 10, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' }
    ],
    'Burger Hub': [
      { name: 'Classic Beef Burger', description: 'Juicy beef patty with lettuce and tomato', price: 180, categoryName: 'Burgers', foodType: 'Non-Veg', isAvailable: true, preparationTime: 15, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
      { name: 'Chicken Burger', description: 'Grilled chicken with special sauce', price: 160, categoryName: 'Burgers', foodType: 'Non-Veg', isAvailable: true, preparationTime: 15, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086' },
      { name: 'Veggie Burger', description: 'Plant-based patty with veggies', price: 140, categoryName: 'Burgers', foodType: 'Veg', isAvailable: true, preparationTime: 12, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360' },
      { name: 'Cheese Fries', description: 'Crispy fries with melted cheese', price: 120, categoryName: 'Sides', foodType: 'Veg', isAvailable: true, preparationTime: 10, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877' },
      { name: 'Onion Rings', description: 'Crispy fried onion rings', price: 100, categoryName: 'Sides', foodType: 'Veg', isAvailable: true, preparationTime: 10, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d' },
      { name: 'Chocolate Shake', description: 'Rich chocolate milkshake', price: 120, categoryName: 'Beverages', foodType: 'Veg', isAvailable: true, preparationTime: 5, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699' }
    ],
    'Chinese Wok': [
      { name: 'Chicken Fried Rice', description: 'Wok-tossed rice with chicken and vegetables', price: 200, categoryName: 'Rice', foodType: 'Non-Veg', isAvailable: true, preparationTime: 15, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b' },
      { name: 'Veg Hakka Noodles', description: 'Stir-fried noodles with vegetables', price: 180, categoryName: 'Noodles', foodType: 'Veg', isAvailable: true, preparationTime: 12, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246' },
      { name: 'Chilli Chicken', description: 'Spicy chicken in Indo-Chinese sauce', price: 240, categoryName: 'Starters', foodType: 'Non-Veg', isAvailable: true, preparationTime: 20, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84' },
      { name: 'Manchurian', description: 'Vegetable balls in tangy sauce', price: 180, categoryName: 'Starters', foodType: 'Veg', isAvailable: true, preparationTime: 18, image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb' },
      { name: 'Spring Rolls', description: 'Crispy vegetable spring rolls', price: 140, categoryName: 'Starters', foodType: 'Veg', isAvailable: true, preparationTime: 15, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270' },
      { name: 'Hot & Sour Soup', description: 'Spicy and tangy soup', price: 100, categoryName: 'Soups', foodType: 'Veg', isAvailable: true, preparationTime: 10, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd' }
    ]
  };

  return (menus[restaurantName] || []).map(item => ({
    ...item,
    restaurant: restaurantId,
    category: categoryMap[item.categoryName]
  }));
};

// Demo coupons
const demoCoupons = [
  {
    code: 'WELCOME50',
    description: 'Get ₹50 off on your first order',
    discountType: 'flat',
    discountValue: 50,
    minOrderValue: 200,
    maxDiscount: 50,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    usageLimit: 1000,
    usedCount: 0,
    isActive: true
  },
  {
    code: 'FLAT100',
    description: 'Flat ₹100 off on orders above ₹500',
    discountType: 'flat',
    discountValue: 100,
    minOrderValue: 500,
    maxDiscount: 100,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    usageLimit: 500,
    usedCount: 0,
    isActive: true
  },
  {
    code: 'SAVE20',
    description: 'Get 20% off on all orders',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 300,
    maxDiscount: 150,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    usageLimit: 200,
    usedCount: 0,
    isActive: true
  },
  {
    code: 'BIRYANI50',
    description: '₹50 off on biryani orders',
    discountType: 'flat',
    discountValue: 50,
    minOrderValue: 250,
    maxDiscount: 50,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
    usageLimit: 300,
    usedCount: 0,
    isActive: true,
    applicableRestaurants: [] // Will be filled with Biryani House ID
  },
  {
    code: 'PIZZA25',
    description: '25% off on pizza orders',
    discountType: 'percentage',
    discountValue: 25,
    minOrderValue: 400,
    maxDiscount: 200,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    usageLimit: 250,
    usedCount: 0,
    isActive: true,
    applicableRestaurants: [] // Will be filled with Pizza Paradise ID
  }
];

// Main seeding function
async function seedDatabase() {
  try {
    console.log('\n🌱 Starting database seeding...\n');

    // Clear existing data (except admin users)
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({ role: { $ne: 'admin' } });
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});
    console.log('✓ Existing data cleared\n');

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.insertMany(demoUsers);
    console.log(`✓ Created ${createdUsers.length} users`);

    // Get vendor IDs
    const vendors = createdUsers.filter(u => u.role === 'vendor');
    const customers = createdUsers.filter(u => u.role === 'customer');
    const deliveryPartners = createdUsers.filter(u => u.role === 'delivery');

    // Create restaurants
    console.log('\n🏪 Creating restaurants...');
    const restaurantsWithOwners = demoRestaurants.map((restaurant, index) => ({
      ...restaurant,
      owner: vendors[index]._id
    }));
    const createdRestaurants = await Restaurant.insertMany(restaurantsWithOwners);
    console.log(`✓ Created ${createdRestaurants.length} restaurants`);

    // Create menu items
    console.log('\n🍽️  Creating menu items...');
    let allMenuItems = [];
    createdRestaurants.forEach(restaurant => {
      const menuItems = getMenuItems(restaurant._id, restaurant.name);
      allMenuItems = allMenuItems.concat(menuItems);
    });
    const createdMenuItems = await MenuItem.insertMany(allMenuItems);
    console.log(`✓ Created ${createdMenuItems.length} menu items`);

    // Create sample orders
    console.log('\n📦 Creating sample orders...');
    const sampleOrders = [];
    
    // Order 1: Delivered order
    const order1Items = [
      { 
        menuItem: createdMenuItems[0]._id, 
        name: createdMenuItems[0].name,
        quantity: 2, 
        price: createdMenuItems[0].price,
        subtotal: createdMenuItems[0].price * 2
      },
      { 
        menuItem: createdMenuItems[4]._id, 
        name: createdMenuItems[4].name,
        quantity: 3, 
        price: createdMenuItems[4].price,
        subtotal: createdMenuItems[4].price * 3
      }
    ];
    const order1Subtotal = order1Items.reduce((sum, item) => sum + item.subtotal, 0);
    sampleOrders.push({
      customer: customers[0]._id,
      restaurant: createdRestaurants[0]._id,
      items: order1Items,
      deliveryAddress: {
        addressLine1: customers[0].addresses[0].addressLine1,
        addressLine2: customers[0].addresses[0].addressLine2,
        city: customers[0].addresses[0].city,
        state: customers[0].addresses[0].state,
        pincode: customers[0].addresses[0].pincode,
        coordinates: {
          type: 'Point',
          coordinates: [77.5946, 12.9716]
        }
      },
      customerPhone: customers[0].phone,
      status: 'delivered',
      paymentMethod: 'online',
      paymentStatus: 'completed',
      deliveryPartner: deliveryPartners[0]._id,
      estimatedDeliveryTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      actualDeliveryTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
    });

    // Order 2: In transit order
    const order2Items = [
      { 
        menuItem: createdMenuItems[6]._id, 
        name: createdMenuItems[6].name,
        quantity: 1, 
        price: createdMenuItems[6].price,
        subtotal: createdMenuItems[6].price
      },
      { 
        menuItem: createdMenuItems[10]._id, 
        name: createdMenuItems[10].name,
        quantity: 2, 
        price: createdMenuItems[10].price,
        subtotal: createdMenuItems[10].price * 2
      }
    ];
    const order2Subtotal = order2Items.reduce((sum, item) => sum + item.subtotal, 0);
    sampleOrders.push({
      customer: customers[1]._id,
      restaurant: createdRestaurants[1]._id,
      items: order2Items,
      deliveryAddress: {
        addressLine1: customers[1].addresses[0].addressLine1,
        addressLine2: customers[1].addresses[0].addressLine2,
        city: customers[1].addresses[0].city,
        state: customers[1].addresses[0].state,
        pincode: customers[1].addresses[0].pincode,
        coordinates: {
          type: 'Point',
          coordinates: [77.6025, 12.9698]
        }
      },
      customerPhone: customers[1].phone,
      status: 'delivering',
      paymentMethod: 'online',
      paymentStatus: 'completed',
      deliveryPartner: deliveryPartners[1]._id,
      estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000)
    });

    // Order 3: Preparing order
    const order3Items = [
      { 
        menuItem: createdMenuItems[12]._id, 
        name: createdMenuItems[12].name,
        quantity: 2, 
        price: createdMenuItems[12].price,
        subtotal: createdMenuItems[12].price * 2
      }
    ];
    const order3Subtotal = order3Items.reduce((sum, item) => sum + item.subtotal, 0);
    sampleOrders.push({
      customer: customers[2]._id,
      restaurant: createdRestaurants[2]._id,
      items: order3Items,
      deliveryAddress: {
        addressLine1: customers[2].addresses[0].addressLine1,
        addressLine2: customers[2].addresses[0].addressLine2,
        city: customers[2].addresses[0].city,
        state: customers[2].addresses[0].state,
        pincode: customers[2].addresses[0].pincode,
        coordinates: {
          type: 'Point',
          coordinates: [77.6245, 12.9352]
        }
      },
      customerPhone: customers[2].phone,
      status: 'preparing',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      estimatedDeliveryTime: new Date(Date.now() + 40 * 60 * 1000)
    });

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✓ Created ${createdOrders.length} sample orders`);

    // Create reviews for delivered orders
    console.log('\n⭐ Creating reviews...');
    const sampleReviews = [
      {
        user: customers[0]._id,
        restaurant: createdRestaurants[0]._id,
        order: createdOrders[0]._id,
        rating: 5,
        comment: 'Excellent food! The butter chicken was amazing and delivery was quick.',
        foodRating: 5,
        deliveryRating: 5
      },
      {
        user: customers[0]._id,
        restaurant: createdRestaurants[1]._id,
        rating: 4,
        comment: 'Great pizza, but slightly delayed delivery.',
        foodRating: 5,
        deliveryRating: 3
      },
      {
        user: customers[1]._id,
        restaurant: createdRestaurants[2]._id,
        rating: 5,
        comment: 'Best biryani in town! Highly recommended.',
        foodRating: 5,
        deliveryRating: 5
      }
    ];
    const createdReviews = await Review.insertMany(sampleReviews);
    console.log(`✓ Created ${createdReviews.length} reviews`);

    // Create coupons
    console.log('\n🎟️  Creating coupons...');
    // Link restaurant-specific coupons
    demoCoupons[3].applicableRestaurants = [createdRestaurants[2]._id]; // Biryani House
    demoCoupons[4].applicableRestaurants = [createdRestaurants[1]._id]; // Pizza Paradise
    
    const createdCoupons = await Coupon.insertMany(demoCoupons);
    console.log(`✓ Created ${createdCoupons.length} coupons`);

    // Print summary
    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 SEEDING SUMMARY');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`   - Customers: ${customers.length}`);
    console.log(`   - Vendors: ${vendors.length}`);
    console.log(`   - Delivery Partners: ${deliveryPartners.length}`);
    console.log(`🏪 Restaurants: ${createdRestaurants.length}`);
    console.log(`🍽️  Menu Items: ${createdMenuItems.length}`);
    console.log(`📦 Orders: ${createdOrders.length}`);
    console.log(`⭐ Reviews: ${createdReviews.length}`);
    console.log(`🎟️  Coupons: ${createdCoupons.length}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📝 Demo Credentials:');
    console.log('───────────────────────────────────────────────────────');
    console.log('Customer: john@example.com / customer123');
    console.log('Vendor: rajesh@vendor.com / vendor123');
    console.log('Delivery: ravi@delivery.com / delivery123');
    console.log('───────────────────────────────────────────────────────');
    console.log('\n🎟️  Active Coupon Codes:');
    console.log('───────────────────────────────────────────────────────');
    demoCoupons.forEach(coupon => {
      console.log(`${coupon.code} - ${coupon.description}`);
    });
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
