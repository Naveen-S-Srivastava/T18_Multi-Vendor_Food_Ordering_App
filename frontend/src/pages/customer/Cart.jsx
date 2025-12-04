import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import './CustomerPages.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, itemCount, updateCartItem, removeFromCart } = useCart();

  if (!cart || itemCount === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <Card className="empty-cart">
            <div className="empty-cart-icon">
              <FaShoppingCart />
            </div>
            <h2>Your cart is empty</h2>
            <p>Add items from restaurants to see them here</p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/restaurants')}
            >
              Browse Restaurants
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (itemId, newQuantity, restaurantId) => {
    if (newQuantity > 0) {
      updateCartItem(itemId, newQuantity, restaurantId);
    } else {
      removeFromCart(itemId);
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Shopping Cart</h1>
          <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="cart-container">
          <div className="cart-items">
            {cart.restaurants?.map((restaurant) => (
              <Card key={restaurant.restaurantId} className="cart-section">
                <h3>{restaurant.restaurantName || 'Restaurant'}</h3>
                {restaurant.items.map((item) => (
                  <div key={item.menuItem} className="cart-item">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h4 className="cart-item-title">{item.name}</h4>
                      <p className="cart-item-price">₹{item.price}</p>
                      <div className="cart-item-actions">
                        <div className="quantity-control">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.menuItem, item.quantity - 1, restaurant.restaurantId)}
                          >
                            -
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.menuItem, item.quantity + 1, restaurant.restaurantId)}
                          >
                            +
                          </button>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<FaTrash />}
                          onClick={() => removeFromCart(item.menuItem)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            ))}
          </div>

          <Card className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cart.totalPrice || 0}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹40</span>
            </div>
            <div className="summary-row">
              <span>Taxes</span>
              <span>₹{((cart.totalPrice || 0) * 0.05).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{((cart.totalPrice || 0) + 40 + (cart.totalPrice || 0) * 0.05).toFixed(2)}</span>
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
