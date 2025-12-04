const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
let authToken = '';
let userId = '';
let restaurantId = '';
let categoryId = '';
let menuItemId = '';
let orderId = '';

// Color codes for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.yellow}${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}${colors.reset}`),
};

// Test function wrapper
async function testEndpoint(name, method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (data) config.data = data;

    const response = await axios(config);
    log.success(`${name}: ${response.status} ${response.statusText}`);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    const errorDetails = error.response?.data?.errors ? ` - ${JSON.stringify(error.response.data.errors)}` : '';
    log.error(`${name}: ${error.response?.status || 'ERROR'} - ${errorMsg}${errorDetails}`);
    return null;
  }
}

async function runTests() {
  console.log('\n🚀 Starting API Tests...\n');

  // 1. Health Check
  log.section('1. HEALTH CHECK');
  await testEndpoint('Health Check', 'GET', '/health');
  await testEndpoint('Test Models', 'GET', '/api/test');

  // 2. Authentication Tests
  log.section('2. AUTHENTICATION TESTS');
  
  // Register Customer
  const timestamp = Date.now();
  const registerData = {
    name: 'Test Customer',
    email: `test${timestamp}@example.com`,
    password: 'password123',
    phone: `98765${String(timestamp).slice(-5)}`,
    role: 'customer',
  };
  const registerRes = await testEndpoint('Register Customer', 'POST', '/api/auth/register', registerData);
  if (registerRes?.data) {
    authToken = registerRes.data.token;
    userId = registerRes.data.user._id;
  }

  // Login
  const loginData = {
    email: registerData.email,
    password: registerData.password,
  };
  const loginRes = await testEndpoint('Login', 'POST', '/api/auth/login', loginData);
  if (loginRes?.data?.token) {
    authToken = loginRes.data.token;
  }

  // Get Profile
  await testEndpoint('Get Profile', 'GET', '/api/auth/me', null, {
    Authorization: `Bearer ${authToken}`,
  });

  // Add Address
  const addressData = {
    label: 'home',
    addressLine1: '123 Main St',
    addressLine2: 'Near Central Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    coordinates: [72.8777, 19.0760],
  };
  await testEndpoint('Add Address', 'POST', '/api/auth/addresses', addressData, {
    Authorization: `Bearer ${authToken}`,
  });

  // 3. Register Vendor and Create Restaurant
  log.section('3. RESTAURANT TESTS');
  
  const vendorRegisterData = {
    name: 'Test Vendor',
    email: `vendor${timestamp}@example.com`,
    password: 'password123',
    phone: `98766${String(timestamp).slice(-5)}`,
    role: 'vendor',
  };
  const vendorRes = await testEndpoint('Register Vendor', 'POST', '/api/auth/register', vendorRegisterData);
  const vendorToken = vendorRes?.data?.token;

  // Create Restaurant
  const restaurantData = {
    name: 'Test Restaurant',
    description: 'A test restaurant serving delicious food',
    cuisineTypes: ['Indian', 'Chinese'],
    phone: '9876543212',
    email: 'restaurant@example.com',
    address: {
      addressLine1: '456 Food St',
      addressLine2: 'Near Market',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      landmark: 'Next to Mall',
    },
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760],
    },
    operatingHours: [
      { day: 'Monday', openTime: '09:00', closeTime: '22:00', isOpen: true },
      { day: 'Tuesday', openTime: '09:00', closeTime: '22:00', isOpen: true },
    ],
  };
  const restaurantRes = await testEndpoint('Create Restaurant', 'POST', '/api/restaurants', restaurantData, {
    Authorization: `Bearer ${vendorToken}`,
  });
  if (restaurantRes?.data) {
    restaurantId = restaurantRes.data._id;
  }

  // Get All Restaurants
  await testEndpoint('Get All Restaurants', 'GET', '/api/restaurants');

  // Search Restaurants
  await testEndpoint('Search Restaurants', 'GET', '/api/restaurants?search=restaurant');

  // Get Nearby Restaurants
  await testEndpoint('Get Nearby Restaurants', 'GET', '/api/restaurants/nearby?lat=19.0760&lng=72.8777&maxDistance=5000');

  // 4. Menu Tests
  log.section('4. MENU TESTS');

  // Create Category
  if (restaurantId) {
    const categoryData = {
      name: 'Starters',
      description: 'Delicious starters',
    };
    const categoryRes = await testEndpoint('Create Category', 'POST', `/api/menu/${restaurantId}/categories`, categoryData, {
      Authorization: `Bearer ${vendorToken}`,
    });
    if (categoryRes?.data) {
      categoryId = categoryRes.data._id;
    }

    // Get Categories
    await testEndpoint('Get Categories', 'GET', `/api/menu/${restaurantId}/categories`);

    // Create Menu Item
    const menuItemData = {
      name: 'Paneer Tikka',
      description: 'Grilled paneer with spices',
      category: categoryId,
      restaurant: restaurantId,
      price: 250,
      foodType: 'Veg',
      images: ['https://example.com/paneer.jpg'],
      isAvailable: true,
    };
    const menuItemRes = await testEndpoint('Create Menu Item', 'POST', `/api/menu/${restaurantId}/items`, menuItemData, {
      Authorization: `Bearer ${vendorToken}`,
    });
    if (menuItemRes?.data) {
      menuItemId = menuItemRes.data._id;
    }

    // Get Menu Items
    await testEndpoint('Get Menu Items', 'GET', `/api/menu/${restaurantId}/items`);
  } else {
    log.error('Skipping menu tests - no restaurantId available');
  }

  // 5. Cart Tests
  log.section('5. CART TESTS');

  // Add to Cart
  if (menuItemId && restaurantId) {
    const cartData = {
      restaurantId: restaurantId,
      menuItem: menuItemId,
      quantity: 2,
    };
    await testEndpoint('Add to Cart', 'POST', '/api/cart/items', cartData, {
      Authorization: `Bearer ${authToken}`,
    });

    // Get Cart
    await testEndpoint('Get Cart', 'GET', '/api/cart', null, {
      Authorization: `Bearer ${authToken}`,
    });

    // Update Cart Item
    await testEndpoint('Update Cart Item', 'PUT', `/api/cart/items/${menuItemId}`, { quantity: 3, restaurantId }, {
      Authorization: `Bearer ${authToken}`,
    });

    // Clear Cart (after order test)
    // await testEndpoint('Clear Cart', 'DELETE', '/api/cart', null, {
    //   Authorization: `Bearer ${authToken}`,
    // });
  } else {
    log.error('Skipping cart tests - no menuItemId available');
  }

  // 6. Coupon Tests
  log.section('6. COUPON TESTS');

  // Get Coupons
  await testEndpoint('Get Active Coupons', 'GET', '/api/coupons');

  // 7. Order Tests
  log.section('7. ORDER TESTS');

  // Create Order (only if we have menu items)
  if (menuItemId && restaurantId) {
    const orderData = {
      items: [
        {
          menuItem: menuItemId,
          restaurant: restaurantId,
          name: 'Paneer Tikka',
          price: 250,
          quantity: 2,
          subtotal: 500,
        }
      ],
      deliveryAddress: {
        label: 'home',
        addressLine1: '123 Main St',
        addressLine2: 'Apartment 5B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        coordinates: {
          type: 'Point',
          coordinates: [72.8777, 19.0760],
        },
      },
      payment: {
        method: 'cod',
      },
      pricing: {
        itemsTotal: 500,
        deliveryFee: 50,
        packagingCharges: 10,
        taxAmount: 30,
        discount: 0,
        couponDiscount: 0,
        platformFee: 10,
        totalAmount: 600,
        grandTotal: 600,
      },
      specialInstructions: 'Please ring the bell',
    };
    const orderRes = await testEndpoint('Create Order', 'POST', '/api/orders', orderData, {
      Authorization: `Bearer ${authToken}`,
    });
    if (orderRes?.data) {
      orderId = orderRes.data._id;
    }
  } else {
    log.error('Skipping order creation - no menuItemId available');
  }

  // Get Orders
  await testEndpoint('Get Orders', 'GET', '/api/orders', null, {
    Authorization: `Bearer ${authToken}`,
  });

  // Get Single Order
  if (orderId) {
    await testEndpoint('Get Single Order', 'GET', `/api/orders/${orderId}`, null, {
      Authorization: `Bearer ${authToken}`,
    });
  }

  // 8. Review Tests
  log.section('8. REVIEW TESTS');

  // Get Reviews
  await testEndpoint('Get Reviews', 'GET', `/api/reviews?restaurant=${restaurantId}`);

  // 9. Notification Tests
  log.section('9. NOTIFICATION TESTS');

  // Get Notifications
  await testEndpoint('Get Notifications', 'GET', '/api/notifications', null, {
    Authorization: `Bearer ${authToken}`,
  });

  // 10. Delivery Tests
  log.section('10. DELIVERY TESTS');

  // Register Delivery Partner
  const deliveryRegisterData = {
    name: 'Test Delivery',
    email: `delivery${timestamp}@example.com`,
    password: 'password123',
    phone: `98767${String(timestamp).slice(-5)}`,
    role: 'delivery',
  };
  const deliveryRes = await testEndpoint('Register Delivery Partner', 'POST', '/api/auth/register', deliveryRegisterData);
  const deliveryToken = deliveryRes?.data?.token;

  // Get Available Deliveries
  await testEndpoint('Get Available Deliveries', 'GET', '/api/deliveries/available?latitude=19.0760&longitude=72.8777', null, {
    Authorization: `Bearer ${deliveryToken}`,
  });

  // Get All Deliveries
  await testEndpoint('Get All Deliveries', 'GET', '/api/deliveries', null, {
    Authorization: `Bearer ${deliveryToken}`,
  });

  // 11. Payment Tests
  log.section('11. PAYMENT TESTS');

  // Get Payments
  await testEndpoint('Get Payments', 'GET', '/api/payments', null, {
    Authorization: `Bearer ${authToken}`,
  });

  // 12. Admin Tests
  log.section('12. ADMIN TESTS (Will Fail - Need Admin Role)');

  // These will fail with current tokens (403 Forbidden)
  await testEndpoint('Get All Users', 'GET', '/api/users', null, {
    Authorization: `Bearer ${authToken}`,
  });

  await testEndpoint('Get User Stats', 'GET', '/api/users/stats', null, {
    Authorization: `Bearer ${authToken}`,
  });

  // Summary
  log.section('🎉 API TESTING COMPLETED');
  log.info('Check the results above for any failures');
  log.info('Protected routes require proper authentication tokens');
  log.info('Admin routes require admin role');
}

// Run tests
runTests().catch((error) => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
