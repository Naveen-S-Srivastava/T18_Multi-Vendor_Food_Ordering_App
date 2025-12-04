const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Import Routes
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendor');
const restaurantRoutes = require('./routes/restaurant');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/order', orderRoutes);

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Join room for restaurant/order updates
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Real-time order status updates
  socket.on('order_update', (data) => {
    io.to(data.orderId).emit('order_status_changed', {
      orderId: data.orderId,
      status: data.status,
      timestamp: new Date(),
    });
    console.log(`Order ${data.orderId} status updated to: ${data.status}`);
  });

  // Real-time delivery tracking
  socket.on('delivery_location', (data) => {
    io.to(data.orderId).emit('delivery_location_update', {
      orderId: data.orderId,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date(),
    });
  });

  // Restaurant notifications
  socket.on('new_order', (data) => {
    io.to(`restaurant_${data.restaurantId}`).emit('incoming_order', {
      orderId: data.orderId,
      items: data.items,
      customerName: data.customerName,
      timestamp: new Date(),
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Expose io to routes for real-time updates
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready on ws://localhost:${PORT}`);
});

module.exports = { app, io, server };
