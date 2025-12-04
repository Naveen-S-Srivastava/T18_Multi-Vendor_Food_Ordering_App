require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Request logging

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Test Route - Get all models
app.get('/api/test', (req, res) => {
  const models = require('./models');
  res.status(200).json({
    success: true,
    message: 'All models loaded successfully',
    models: Object.keys(models)
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/deliveries', require('./routes/deliveryRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log(`   Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log('🚀 ========================================');
});

// Socket.IO Setup (for real-time features)
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Make io accessible to routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log('👤 New client connected:', socket.id);
  
  // Join room based on user role and ID
  socket.on('join', (data) => {
    const { userId, role } = data;
    socket.join(`${role}_${userId}`);
    console.log(`👤 User ${userId} (${role}) joined`);
  });
  
  // Order tracking room
  socket.on('track_order', (orderId) => {
    socket.join(`order_${orderId}`);
  });
  
  // Delivery partner location update
  socket.on('location_update', (data) => {
    const { deliveryId, location } = data;
    io.to(`order_${deliveryId}`).emit('delivery_location', location);
  });
  
  // Order status update
  socket.on('order_status', (data) => {
    const { orderId, status } = data;
    io.to(`customer_${data.customerId}`).emit('order_update', { orderId, status });
  });
  
  socket.on('disconnect', () => {
    console.log('👋 Client disconnected:', socket.id);
  });
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('💤 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
  });
});

module.exports = app;
