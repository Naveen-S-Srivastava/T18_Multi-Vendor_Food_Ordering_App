// Socket.io helper functions for real-time updates

const emitToUser = (io, userId, role, event, data) => {
  io.to(`${role}_${userId}`).emit(event, data);
};

const emitToOrder = (io, orderId, event, data) => {
  io.to(`order_${orderId}`).emit(event, data);
};

const emitOrderUpdate = (io, order) => {
  // Emit to customer
  emitToUser(io, order.customer, 'customer', 'order_update', {
    orderId: order._id,
    status: order.status,
    estimatedDeliveryTime: order.estimatedDeliveryTime,
    actualDeliveryTime: order.actualDeliveryTime
  });
  
  // Emit to restaurant/vendor
  if (order.restaurant && order.restaurant.owner) {
    emitToUser(io, order.restaurant.owner, 'vendor', 'new_order', {
      orderId: order._id,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status
    });
  }
  
  // Emit to delivery partner if assigned
  if (order.deliveryPartner) {
    emitToUser(io, order.deliveryPartner, 'delivery', 'delivery_assigned', {
      orderId: order._id,
      pickupAddress: order.restaurant.address,
      deliveryAddress: order.deliveryAddress,
      status: order.status
    });
  }
  
  // Emit to order tracking room
  emitToOrder(io, order._id, 'status_update', {
    status: order.status,
    timestamp: new Date()
  });
};

const emitDeliveryLocation = (io, orderId, location) => {
  emitToOrder(io, orderId, 'delivery_location', {
    coordinates: location,
    timestamp: new Date()
  });
};

const emitNotification = (io, userId, role, notification) => {
  emitToUser(io, userId, role, 'notification', notification);
};

module.exports = {
  emitToUser,
  emitToOrder,
  emitOrderUpdate,
  emitDeliveryLocation,
  emitNotification
};
