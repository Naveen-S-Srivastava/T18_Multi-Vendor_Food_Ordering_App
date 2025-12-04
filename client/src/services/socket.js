import io from 'socket.io-client';

// Initialize Socket.IO connection
const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

// Connection event listeners
socket.on('connect', () => {
  console.log('Connected to server via WebSocket');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
});

// Real-time order updates
export const subscribeToOrderUpdates = (orderId, callback) => {
  socket.emit('join_room', orderId);
  socket.on('order_status_changed', callback);
};

export const unsubscribeFromOrderUpdates = (callback) => {
  socket.off('order_status_changed', callback);
};

// Real-time delivery tracking
export const subscribeToDeliveryUpdates = (orderId, callback) => {
  socket.emit('join_room', orderId);
  socket.on('delivery_location_update', callback);
};

export const unsubscribeFromDeliveryUpdates = (callback) => {
  socket.off('delivery_location_update', callback);
};

// Restaurant notifications
export const subscribeToRestaurantOrders = (restaurantId, callback) => {
  socket.emit('join_room', `restaurant_${restaurantId}`);
  socket.on('incoming_order', callback);
};

export const unsubscribeFromRestaurantOrders = (callback) => {
  socket.off('incoming_order', callback);
};

// Emit order updates
export const emitOrderUpdate = (orderId, status) => {
  socket.emit('order_update', { orderId, status });
};

// Emit delivery location
export const emitDeliveryLocation = (orderId, latitude, longitude) => {
  socket.emit('delivery_location', { orderId, latitude, longitude });
};

// Emit new order notification
export const emitNewOrder = (restaurantId, orderId, items, customerName) => {
  socket.emit('new_order', { restaurantId, orderId, items, customerName });
};

// Get socket instance for custom events
export const getSocket = () => socket;

export default socket;
