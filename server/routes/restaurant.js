const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true }).populate('vendorId', 'name email phone');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('vendorId', 'name email phone');
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create restaurant (vendor only)
router.post('/', async (req, res) => {
  try {
    const { name, description, cuisine, address, city, phone, image } = req.body;

    if (!name || !address || !city) {
      return res.status(400).json({ error: 'Name, address, and city are required' });
    }

    const newRestaurant = new Restaurant({
      name,
      description,
      cuisine: cuisine || [],
      address,
      city,
      phone,
      image,
      vendorId: req.body.vendorId || req.user?.id,
    });

    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update restaurant
router.put('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete restaurant
router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
