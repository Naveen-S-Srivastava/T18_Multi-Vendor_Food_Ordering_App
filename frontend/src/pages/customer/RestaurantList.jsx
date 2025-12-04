import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../../services/api';
import { FaStar, FaClock, FaMapMarkerAlt, FaSearch, FaFilter } from 'react-icons/fa';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import './CustomerPages.css';

const RestaurantList = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  
  const cuisines = ['All', 'Indian', 'Chinese', 'Italian', 'Mexican', 'Japanese', 'American'];

  useEffect(() => {
    fetchRestaurants();
  }, [search, selectedCuisine]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedCuisine && selectedCuisine !== 'All') params.cuisine = selectedCuisine;
      
      const response = await restaurantAPI.getAll(params);
      setRestaurants(response.data.data);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen text="Loading restaurants..." />;

  return (
    <div className="restaurants-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Restaurants Near You</h1>
          <p>Discover and order from the best restaurants</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <Input
            type="search"
            placeholder="Search restaurants or cuisines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<FaSearch />}
            className="search-input"
          />
          
          <div className="cuisine-filters">
            {cuisines.map((cuisine) => (
              <Button
                key={cuisine}
                variant={selectedCuisine === cuisine ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCuisine(cuisine === 'All' ? '' : cuisine)}
              >
                {cuisine}
              </Button>
            ))}
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="restaurants-grid">
          {restaurants.length === 0 ? (
            <div className="no-results">
              <h3>No restaurants found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            restaurants.map((restaurant) => (
              <Card
                key={restaurant._id}
                className="restaurant-card"
                shadow="md"
                hover
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              >
                <div className="restaurant-image">
                  <img
                    src={restaurant.images?.[0] || 'https://via.placeholder.com/400x250?text=Restaurant'}
                    alt={restaurant.name}
                  />
                  {restaurant.isOpen && (
                    <span className="open-badge">Open Now</span>
                  )}
                </div>
                <div className="restaurant-info">
                  <h3>{restaurant.name}</h3>
                  <p className="restaurant-cuisines">
                    {restaurant.cuisineTypes?.join(', ') || 'Multiple Cuisines'}
                  </p>
                  <div className="restaurant-meta">
                    <div className="meta-item">
                      <FaStar className="icon-star" />
                      <span>{restaurant.rating?.average?.toFixed(1) || '4.0'}</span>
                      <span className="meta-light">({restaurant.rating?.count || 0})</span>
                    </div>
                    <div className="meta-item">
                      <FaClock className="icon-secondary" />
                      <span>{restaurant.deliveryTime || '30-40'} min</span>
                    </div>
                    <div className="meta-item">
                      <FaMapMarkerAlt className="icon-secondary" />
                      <span>{restaurant.distance || '2.5'} km</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
