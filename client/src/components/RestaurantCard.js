import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="restaurant-card">
      <div className="restaurant-image">
        {restaurant.image ? (
          <img src={restaurant.image} alt={restaurant.name} />
        ) : (
          <div className="placeholder">🏪</div>
        )}
      </div>
      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <p className="description">{restaurant.description}</p>
        <div className="restaurant-meta">
          <span className="rating">⭐ {restaurant.rating}</span>
          <span className="location">📍 {restaurant.city}</span>
        </div>
        <div className="restaurant-footer">
          <span className="delivery">🚗 {restaurant.deliveryTime} mins</span>
          <span className="cuisine">
            {restaurant.cuisine
              ? typeof restaurant.cuisine === 'string'
                ? restaurant.cuisine
                : restaurant.cuisine.join(', ')
              : 'Multi-cuisine'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
