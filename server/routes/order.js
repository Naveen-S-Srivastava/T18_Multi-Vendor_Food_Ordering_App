const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Helper function to generate order ID
const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email phone')
      .populate('restaurantId', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email phone address')
      .populate('restaurantId', 'name phone');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const { customerId, restaurantId, items, deliveryAddress, paymentMethod, specialInstructions } = req.body;

    if (!customerId || !restaurantId || !items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({ 
        error: 'customerId, restaurantId, items, and deliveryAddress are required' 
      });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      orderId: generateOrderId(),
      customerId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cash',
      specialInstructions,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders by customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId })
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
