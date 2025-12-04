import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  useEffect(() => {
    if (cart) {
      const count = cart.restaurants?.reduce((total, restaurant) => {
        return total + restaurant.items.reduce((sum, item) => sum + item.quantity, 0);
      }, 0) || 0;
      setItemCount(count);
    } else {
      setItemCount(0);
    }
  }, [cart]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (restaurantId, menuItem, quantity = 1) => {
    try {
      const response = await cartAPI.addItem({
        restaurantId,
        menuItem: menuItem._id,
        quantity,
      });
      setCart(response.data.data);
      toast.success(`${menuItem.name} added to cart`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateCartItem = async (menuItemId, quantity, restaurantId) => {
    try {
      const response = await cartAPI.updateItem(menuItemId, { quantity, restaurantId });
      setCart(response.data.data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  const removeFromCart = async (menuItemId) => {
    try {
      const response = await cartAPI.removeItem(menuItemId);
      setCart(response.data.data);
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      return { success: false, message };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart(null);
      toast.success('Cart cleared');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  const applyCoupon = async (code) => {
    try {
      const response = await cartAPI.applyCoupon(code);
      setCart(response.data.data);
      toast.success('Coupon applied successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid coupon';
      toast.error(message);
      return { success: false, message };
    }
  };

  const removeCoupon = async () => {
    try {
      const response = await cartAPI.removeCoupon();
      setCart(response.data.data);
      toast.success('Coupon removed');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove coupon';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    cart,
    loading,
    itemCount,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
