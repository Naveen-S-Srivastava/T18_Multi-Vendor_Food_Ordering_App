// Export all models from a single entry point
module.exports = {
  User: require('./User'),
  Restaurant: require('./Restaurant'),
  Category: require('./Category'),
  MenuItem: require('./MenuItem'),
  Cart: require('./Cart'),
  Order: require('./Order'),
  Delivery: require('./Delivery'),
  Payment: require('./Payment'),
  Review: require('./Review'),
  Notification: require('./Notification'),
  Coupon: require('./Coupon')
};
