const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor', isActive: true });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor by ID
router.get('/:id', async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);

    if (!vendor || vendor.role !== 'vendor') {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update vendor
router.put('/:id', async (req, res) => {
  try {
    const vendor = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
