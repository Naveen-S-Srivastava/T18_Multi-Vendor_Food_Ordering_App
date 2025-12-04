const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cuisine: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    deliveryTime: {
      type: Number,
      default: 30,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
