import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantService, menuService, orderService } from '../services/api';
import MenuItem from '../components/MenuItem';
import './Restaurant.css';

const Restaurant = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const restaurantRes = await restaurantService.getById(id);
      setRestaurant(restaurantRes.data);

      const menuRes = await menuService.getByRestaurant(id);
      setMenuItems(menuRes.data);
    } catch (err) {
      setError('Failed to load restaurant details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(cart.filter((item) => item._id !== itemId));
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(itemId);
    } else {
      setCart(
        cart.map((item) =>
          item._id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      const orderData = {
        customerId: user.id,
        restaurantId: id,
        items: cart.map((item) => ({
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: getTotalAmount(),
        deliveryAddress: user.address || 'Address to be provided',
        paymentMethod: 'cash',
      };

      const response = await orderService.create(orderData);
      alert(`Order placed successfully! Order ID: ${response.data.orderId}`);
      setCart([]);
      navigate('/');
    } catch (err) {
      alert('Failed to place order');
      console.error(err);
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) return <div className="loading">Loading restaurant details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!restaurant) return <div className="error">Restaurant not found</div>;

  return (
    <div className="restaurant-page">
      <div className="restaurant-header">
        <div className="restaurant-banner">
          {restaurant.image ? (
            <img src={restaurant.image} alt={restaurant.name} />
          ) : (
            <div className="placeholder">🏪</div>
          )}
        </div>
        <div className="restaurant-details">
          <h1>{restaurant.name}</h1>
          <p className="description">{restaurant.description}</p>
          <div className="details-row">
            <span>⭐ {restaurant.rating}</span>
            <span>📍 {restaurant.address}, {restaurant.city}</span>
            <span>🚗 {restaurant.deliveryTime} mins delivery</span>
            <span>💵 Delivery Fee: ₹{restaurant.deliveryFee}</span>
          </div>
        </div>
      </div>

      <div className="restaurant-content">
        <div className="menu-section">
          <h2>Menu</h2>
          <div className="menu-grid">
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <MenuItem
                  key={item._id}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <div className="no-items">No menu items available</div>
            )}
          </div>
        </div>

        <div className="cart-section">
          <h3>Cart</h3>
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">₹{item.price}</p>
                    </div>
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <p className="item-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee:</span>
                  <span>₹{restaurant.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>
                    ₹{(getTotalAmount() + restaurant.deliveryFee).toFixed(2)}
                  </span>
                </div>
                <button onClick={handleCheckout} className="checkout-btn">
                  Place Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
