const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Get all menu items for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      restaurantId: req.params.restaurantId,
      isAvailable: true 
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create menu item
router.post('/', async (req, res) => {
  try {
    const { name, description, restaurantId, price, category, image } = req.body;

    if (!name || !restaurantId || !price || !category) {
      return res.status(400).json({ error: 'Name, restaurantId, price, and category are required' });
    }

    const newMenuItem = new MenuItem({
      name,
      description,
      restaurantId,
      price,
      category,
      image,
    });

    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update menu item
router.put('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
