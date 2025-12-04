# MongoDB & WebSocket Integration Guide

## Overview

This document explains how MongoDB and WebSocket are integrated into the FoodHub application for real-time data management and live updates.

---

## 1. MongoDB Setup

### Installation

MongoDB is already configured in your project. Make sure you have MongoDB installed locally or use MongoDB Atlas for cloud hosting.

**Local MongoDB:**
```bash
# Windows (with MongoDB installed)
mongod

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Add to `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food_ordering`

### Environment Variables

```env
# server/.env
MONGODB_URI=mongodb://localhost:27017/food_ordering
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3000
```

### Database Models

The following MongoDB models are used:

**User Model:**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: String (customer, vendor, admin),
  createdAt: Date,
  updatedAt: Date
}
```

**Restaurant Model:**
```javascript
{
  name: String,
  vendorId: ObjectId,
  city: String,
  cuisine: [String],
  rating: Number,
  description: String,
  image: String,
  deliveryTime: String,
  isActive: Boolean,
  createdAt: Date
}
```

**Menu Item Model:**
```javascript
{
  restaurantId: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  rating: Number,
  isAvailable: Boolean,
  createdAt: Date
}
```

**Order Model:**
```javascript
{
  customerId: ObjectId,
  restaurantId: ObjectId,
  items: [{
    itemId: ObjectId,
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String (pending, confirmed, preparing, out_for_delivery, delivered),
  deliveryAddress: String,
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 2. WebSocket Integration

### Server Setup (Socket.IO)

The server is configured with Socket.IO for real-time bidirectional communication:

**Key Features:**
- Real-time order status updates
- Live delivery tracking
- Restaurant notifications
- Automatic reconnection
- Error handling

**Server Configuration (server.js):**
```javascript
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
```

### WebSocket Events

#### Server → Client Events

**Order Status Updates:**
```javascript
// Listen on client
socket.on('order_status_changed', (data) => {
  console.log(`Order ${data.orderId} status: ${data.status}`);
  // data: { orderId, status, timestamp }
});
```

**Delivery Location Updates:**
```javascript
// Listen on client
socket.on('delivery_location_update', (data) => {
  console.log(`Delivery at: ${data.latitude}, ${data.longitude}`);
  // data: { orderId, latitude, longitude, timestamp }
});
```

**Incoming Restaurant Orders:**
```javascript
// Listen on client
socket.on('incoming_order', (data) => {
  console.log(`New order from ${data.customerName}`);
  // data: { orderId, items, customerName, timestamp }
});
```

#### Client → Server Events

**Join a Room (Subscribe to Updates):**
```javascript
socket.emit('join_room', 'order_123');
socket.emit('join_room', 'restaurant_456');
```

**Emit Order Update:**
```javascript
socket.emit('order_update', {
  orderId: 'order_123',
  status: 'preparing'
});
```

**Emit Delivery Location:**
```javascript
socket.emit('delivery_location', {
  orderId: 'order_123',
  latitude: 40.7128,
  longitude: -74.0060
});
```

**Emit New Order Notification:**
```javascript
socket.emit('new_order', {
  restaurantId: 'restaurant_456',
  orderId: 'order_123',
  items: [...],
  customerName: 'John Doe'
});
```

---

## 3. Frontend Integration

### Socket Service

A socket service is provided at `src/services/socket.js`:

```javascript
import {
  subscribeToOrderUpdates,
  subscribeToDeliveryUpdates,
  subscribeToRestaurantOrders,
  emitOrderUpdate,
  emitDeliveryLocation,
  emitNewOrder,
} from './services/socket';
```

### Custom Hooks

Pre-built hooks are available in `src/hooks/useWebSocket.js`:

**useOrderStatus Hook:**
```javascript
import { useOrderStatus } from '../hooks/useWebSocket';

function OrderTracker({ orderId }) {
  const { orderStatus, updateOrderStatus } = useOrderStatus(orderId);

  return (
    <div>
      <p>Current Status: {orderStatus}</p>
      <button onClick={() => updateOrderStatus('delivered')}>
        Mark Delivered
      </button>
    </div>
  );
}
```

**useDeliveryTracking Hook:**
```javascript
import { useDeliveryTracking } from '../hooks/useWebSocket';

function DeliveryMap({ orderId }) {
  const { deliveryLocation, updateDeliveryLocation } = useDeliveryTracking(orderId);

  return (
    <div>
      {deliveryLocation && (
        <p>Delivery at: {deliveryLocation.latitude}, {deliveryLocation.longitude}</p>
      )}
    </div>
  );
}
```

**useRestaurantOrders Hook:**
```javascript
import { useRestaurantOrders } from '../hooks/useWebSocket';

function RestaurantDashboard({ restaurantId }) {
  const { incomingOrder, notifyNewOrder } = useRestaurantOrders(restaurantId);

  return (
    <div>
      {incomingOrder && (
        <div>New Order from {incomingOrder.customerName}</div>
      )}
    </div>
  );
}
```

### Manual Socket Usage

```javascript
import socket from '../services/socket';

// Direct subscription
socket.on('order_status_changed', (data) => {
  console.log('Order status:', data.status);
});

// Direct emission
socket.emit('order_update', {
  orderId: 'order_123',
  status: 'confirmed'
});
```

---

## 4. Usage Examples

### Example 1: Track Order Status

**Component (OrderTracking.jsx):**
```javascript
import React from 'react';
import { useOrderStatus } from '../hooks/useWebSocket';

export default function OrderTracking({ orderId }) {
  const { orderStatus, updateOrderStatus } = useOrderStatus(orderId);

  const handleStatusUpdate = async () => {
    const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const currentIndex = statuses.indexOf(orderStatus);
    const nextStatus = statuses[currentIndex + 1];
    
    if (nextStatus) {
      updateOrderStatus(nextStatus);
    }
  };

  return (
    <div className="order-tracking">
      <h2>Order Tracking</h2>
      <p>Current Status: <strong>{orderStatus}</strong></p>
      <button onClick={handleStatusUpdate}>Update Status</button>
    </div>
  );
}
```

### Example 2: Real-time Delivery Map

**Component (DeliveryTracking.jsx):**
```javascript
import React from 'react';
import { useDeliveryTracking } from '../hooks/useWebSocket';

export default function DeliveryTracking({ orderId }) {
  const { deliveryLocation, updateDeliveryLocation } = useDeliveryTracking(orderId);

  React.useEffect(() => {
    // Simulate delivery location updates
    const interval = setInterval(() => {
      const randomLat = 40.7128 + Math.random() * 0.01;
      const randomLng = -74.0060 + Math.random() * 0.01;
      updateDeliveryLocation(randomLat, randomLng);
    }, 5000);

    return () => clearInterval(interval);
  }, [updateDeliveryLocation]);

  return (
    <div className="delivery-map">
      <h2>Delivery Tracking</h2>
      {deliveryLocation && (
        <div>
          <p>Latitude: {deliveryLocation.latitude.toFixed(4)}</p>
          <p>Longitude: {deliveryLocation.longitude.toFixed(4)}</p>
          <p>Updated: {deliveryLocation.timestamp.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
```

### Example 3: Restaurant Order Notifications

**Component (RestaurantDashboard.jsx):**
```javascript
import React from 'react';
import { useRestaurantOrders } from '../hooks/useWebSocket';

export default function RestaurantDashboard({ restaurantId }) {
  const { incomingOrder } = useRestaurantOrders(restaurantId);
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    if (incomingOrder) {
      setOrders([incomingOrder, ...orders]);
      // Show notification sound/alert
      playNotificationSound();
    }
  }, [incomingOrder]);

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play();
  };

  return (
    <div className="restaurant-dashboard">
      <h2>Incoming Orders</h2>
      {orders.map((order) => (
        <div key={order.orderId} className="order-card">
          <h3>{order.customerName}</h3>
          <p>Order ID: {order.orderId}</p>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>{item.name} x{item.quantity}</li>
            ))}
          </ul>
          <p>Received: {order.timestamp.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 5. Backend Integration

### Emitting Events from Routes

To emit WebSocket events from your API routes:

```javascript
// routes/order.js
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Emit WebSocket event
    req.io.to(`restaurant_${order.restaurantId}`).emit('incoming_order', {
      orderId: order._id,
      items: order.items,
      customerName: order.customerName,
      timestamp: new Date(),
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### Example: Update Order Status

```javascript
// routes/order.js
router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    // Notify all users tracking this order
    req.io.to(order._id.toString()).emit('order_status_changed', {
      orderId: order._id,
      status: order.status,
      timestamp: new Date(),
    });

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## 6. Installation & Setup

### Backend Setup

```bash
cd server
npm install socket.io
npm start
```

### Frontend Setup

```bash
cd client
npm install socket.io-client
npm start
```

### Environment Variables

**Server (.env):**
```
MONGODB_URI=mongodb://localhost:27017/food_ordering
CLIENT_URL=http://localhost:3000
PORT=5000
```

**Client (.env.local):**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 7. Testing WebSocket

### Using Browser DevTools

```javascript
// In browser console
const socket = io('http://localhost:5000');
socket.on('connect', () => console.log('Connected'));
socket.emit('join_room', 'order_123');
```

### Using Socket.IO Web Client

Visit: http://localhost:5000/socket.io/

---

## 8. Troubleshooting

### Connection Issues

**Problem:** "Connection refused"
- Ensure server is running on port 5000
- Check `CLIENT_URL` in .env matches client origin

**Problem:** "Socket connection timeout"
- Check firewall settings
- Verify CORS configuration
- Ensure WebSocket protocol is enabled

### MongoDB Connection Issues

**Problem:** "MongooseError: connect failed"
- Verify MongoDB is running
- Check connection string in .env
- Ensure database name is correct

### Real-time Updates Not Working

**Problem:** Events not being received
- Verify room subscription with `socket.emit('join_room', roomId)`
- Check event names match exactly
- Use browser DevTools Network tab to monitor WebSocket frames

---

## 9. Production Deployment

### MongoDB Atlas

1. Create cluster on MongoDB Atlas
2. Add IP whitelist
3. Create database user
4. Update connection string

### WebSocket Production

```javascript
// Production configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});
```

### Environment Variables

```env
# Production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/food_ordering
CLIENT_URL=https://yourdomain.com
NODE_ENV=production
```

---

## 10. Best Practices

1. **Always unsubscribe** from events in cleanup:
   ```javascript
   useEffect(() => {
     subscribeToOrderUpdates(orderId, callback);
     return () => unsubscribeFromOrderUpdates(callback);
   }, [orderId]);
   ```

2. **Handle errors gracefully:**
   ```javascript
   socket.on('connect_error', (error) => {
     console.error('Connection error:', error);
     // Show user-friendly message
   });
   ```

3. **Validate data** on both client and server

4. **Use rooms** to organize subscriptions

5. **Emit only necessary data** to reduce bandwidth

6. **Test on slow networks** to ensure reliability

---

## Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Real-time Web Applications](https://en.wikipedia.org/wiki/Real-time_web)

---

**Status:** ✅ MongoDB & WebSocket fully integrated

**Last Updated:** December 2024

**Version:** 1.0.0
