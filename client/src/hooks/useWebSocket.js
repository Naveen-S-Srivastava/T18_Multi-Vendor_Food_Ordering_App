import { useEffect, useCallback } from 'react';
import {
  subscribeToOrderUpdates,
  unsubscribeFromOrderUpdates,
  subscribeToDeliveryUpdates,
  unsubscribeFromDeliveryUpdates,
  subscribeToRestaurantOrders,
  unsubscribeFromRestaurantOrders,
  emitOrderUpdate,
  emitDeliveryLocation,
  emitNewOrder,
} from '../services/socket';

/**
 * Hook for real-time order status updates
 * Usage: const { orderStatus } = useOrderStatus(orderId);
 */
export const useOrderStatus = (orderId) => {
  const [orderStatus, setOrderStatus] = React.useState(null);

  useEffect(() => {
    const handleOrderUpdate = (data) => {
      console.log('Order status updated:', data);
      setOrderStatus(data.status);
    };

    subscribeToOrderUpdates(orderId, handleOrderUpdate);

    return () => {
      unsubscribeFromOrderUpdates(handleOrderUpdate);
    };
  }, [orderId]);

  const updateOrderStatus = useCallback(
    (newStatus) => {
      emitOrderUpdate(orderId, newStatus);
    },
    [orderId]
  );

  return { orderStatus, updateOrderStatus };
};

/**
 * Hook for real-time delivery tracking
 * Usage: const { deliveryLocation } = useDeliveryTracking(orderId);
 */
export const useDeliveryTracking = (orderId) => {
  const [deliveryLocation, setDeliveryLocation] = React.useState(null);

  useEffect(() => {
    const handleLocationUpdate = (data) => {
      console.log('Delivery location updated:', data);
      setDeliveryLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date(data.timestamp),
      });
    };

    subscribeToDeliveryUpdates(orderId, handleLocationUpdate);

    return () => {
      unsubscribeFromDeliveryUpdates(handleLocationUpdate);
    };
  }, [orderId]);

  const updateDeliveryLocation = useCallback(
    (latitude, longitude) => {
      emitDeliveryLocation(orderId, latitude, longitude);
    },
    [orderId]
  );

  return { deliveryLocation, updateDeliveryLocation };
};

/**
 * Hook for restaurant incoming orders
 * Usage: const { incomingOrder } = useRestaurantOrders(restaurantId);
 */
export const useRestaurantOrders = (restaurantId) => {
  const [incomingOrder, setIncomingOrder] = React.useState(null);

  useEffect(() => {
    const handleIncomingOrder = (data) => {
      console.log('New incoming order:', data);
      setIncomingOrder({
        orderId: data.orderId,
        items: data.items,
        customerName: data.customerName,
        timestamp: new Date(data.timestamp),
      });
    };

    subscribeToRestaurantOrders(restaurantId, handleIncomingOrder);

    return () => {
      unsubscribeFromRestaurantOrders(handleIncomingOrder);
    };
  }, [restaurantId]);

  const notifyNewOrder = useCallback(
    (orderId, items, customerName) => {
      emitNewOrder(restaurantId, orderId, items, customerName);
    },
    [restaurantId]
  );

  return { incomingOrder, notifyNewOrder };
};
