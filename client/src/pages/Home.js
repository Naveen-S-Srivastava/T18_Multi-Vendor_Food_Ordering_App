import React, { useState, useEffect } from 'react';
import { restaurantService } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import './Home.css';

// Demo/Fallback restaurant data
const DEMO_RESTAURANTS = [
  {
    _id: '1',
    name: 'Pizza Palace',
    city: 'New York',
    cuisine: 'Italian',
    rating: 4.8,
    deliveryTime: '30-40 min',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=300&fit=crop',
    description: 'Authentic Italian pizzas and pasta',
  },
  {
    _id: '2',
    name: 'Burger Barn',
    city: 'Los Angeles',
    cuisine: 'American',
    rating: 4.5,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop',
    description: 'Juicy burgers and crispy fries',
  },
  {
    _id: '3',
    name: 'Sushi Supreme',
    city: 'San Francisco',
    cuisine: 'Japanese',
    rating: 4.9,
    deliveryTime: '35-45 min',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop',
    description: 'Premium sushi and Asian cuisine',
  },
  {
    _id: '4',
    name: 'Taco Fiesta',
    city: 'Austin',
    cuisine: 'Mexican',
    rating: 4.6,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=300&fit=crop',
    description: 'Authentic Mexican street food',
  },
  {
    _id: '5',
    name: 'Green Garden',
    city: 'Portland',
    cuisine: 'Vegetarian',
    rating: 4.7,
    deliveryTime: '30-40 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
    description: 'Fresh and healthy vegetarian options',
  },
  {
    _id: '6',
    name: 'Dragon Wok',
    city: 'Chicago',
    cuisine: 'Chinese',
    rating: 4.4,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1585521922145-f0f1a7e45af5?w=500&h=300&fit=crop',
    description: 'Traditional Chinese cooking',
  },
  {
    _id: '7',
    name: 'Curry House',
    city: 'London',
    cuisine: 'Indian',
    rating: 4.7,
    deliveryTime: '40-50 min',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=300&fit=crop',
    description: 'Authentic Indian curries and spices',
  },
  {
    _id: '8',
    name: 'Sweet Treats',
    city: 'Boston',
    cuisine: 'Dessert',
    rating: 4.8,
    deliveryTime: '15-25 min',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=300&fit=crop',
    description: 'Cakes, pastries, and sweet delights',
  },
];

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getAll();
      setRestaurants(response.data);
    } catch (err) {
      console.error('API Error:', err);
      // Use demo data as fallback
      setRestaurants(DEMO_RESTAURANTS);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to FoodHub</h1>
        <p>Order from your favorite restaurants</p>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by restaurant name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="restaurants-section">
        <div className="container">
          <h2>Featured Restaurants</h2>
          {loading && <div className="loading">Loading restaurants...</div>}
          <div className="restaurants-grid">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))
            ) : (
              <div className="no-results">
                {searchQuery ? 'No restaurants found' : 'No restaurants available'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
