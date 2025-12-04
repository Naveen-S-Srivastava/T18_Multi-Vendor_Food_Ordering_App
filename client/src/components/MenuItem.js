import React from 'react';
import './MenuItem.css';

const MenuItem = ({ item, onAddToCart }) => {
  return (
    <div className="menu-item">
      <div className="menu-item-image">
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <div className="placeholder">🍽️</div>
        )}
      </div>
      <div className="menu-item-info">
        <h4>{item.name}</h4>
        <p className="category">{item.category}</p>
        {item.description && <p className="description">{item.description}</p>}
        <div className="menu-item-footer">
          <span className="price">₹{item.price}</span>
          {item.isAvailable ? (
            <button onClick={() => onAddToCart(item)} className="add-btn">
              Add to Cart
            </button>
          ) : (
            <button className="add-btn disabled">Out of Stock</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
