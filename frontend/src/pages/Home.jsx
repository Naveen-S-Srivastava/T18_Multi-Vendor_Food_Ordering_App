import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaShippingFast, FaUtensils, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaSearch />,
      title: 'Wide Selection',
      description: 'Browse hundreds of restaurants and cuisines'
    },
    {
      icon: <FaShippingFast />,
      title: 'Fast Delivery',
      description: 'Get your food delivered in 30 minutes or less'
    },
    {
      icon: <FaStar />,
      title: 'Quality Food',
      description: 'Only the best restaurants on our platform'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Track Orders',
      description: 'Real-time tracking of your delivery'
    }
  ];

  const cuisines = [
    { name: 'Indian', emoji: '🍛', count: 150 },
    { name: 'Chinese', emoji: '🍜', count: 120 },
    { name: 'Italian', emoji: '🍕', count: 95 },
    { name: 'Mexican', emoji: '🌮', count: 80 },
    { name: 'Japanese', emoji: '🍱', count: 70 },
    { name: 'American', emoji: '🍔', count: 110 },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Your Favorite Food
                <span className="highlight"> Delivered Hot </span>
                & Fresh
              </h1>
              <p className="hero-description">
                Order from the best local restaurants with easy, on-demand delivery.
                Fast, reliable, and delicious every time.
              </p>
              <div className="hero-actions">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/restaurants')}
                >
                  Order Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/register?role=vendor')}
                >
                  Partner with Us
                </Button>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-food-circle">
                <span className="food-emoji">🍔</span>
                <span className="food-emoji">🍕</span>
                <span className="food-emoji">🍜</span>
                <span className="food-emoji">🌮</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Foodie?</h2>
            <p>We make food ordering simple, fast, and reliable</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card" shadow="md" hover>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cuisines Section */}
      <section className="cuisines-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Cuisines</h2>
            <p>Explore dishes from around the world</p>
          </div>
          <div className="cuisines-grid">
            {cuisines.map((cuisine, index) => (
              <Card 
                key={index} 
                className="cuisine-card" 
                shadow="sm" 
                hover
                onClick={() => navigate(`/restaurants?cuisine=${cuisine.name}`)}
              >
                <div className="cuisine-emoji">{cuisine.emoji}</div>
                <h4>{cuisine.name}</h4>
                <p className="cuisine-count">{cuisine.count}+ restaurants</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <Card className="cta-card" shadow="xl">
            <h2>Ready to Order?</h2>
            <p>Join thousands of happy customers ordering delicious food every day</p>
            <div className="cta-actions">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/restaurants')}
              >
                Browse Restaurants
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/register')}
              >
                Sign Up Free
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <div className="container">
          <div className="section-header">
            <h2>Become a Partner</h2>
            <p>Grow your business with Foodie</p>
          </div>
          <div className="partners-grid">
            <Card className="partner-card" shadow="md" hover>
              <div className="partner-icon">🏪</div>
              <h3>Restaurant Owners</h3>
              <p>Reach more customers and increase your sales</p>
              <Button 
                variant="outline"
                onClick={() => navigate('/register?role=vendor')}
              >
                Partner Now
              </Button>
            </Card>
            <Card className="partner-card" shadow="md" hover>
              <div className="partner-icon">🏍️</div>
              <h3>Delivery Partners</h3>
              <p>Earn money with flexible delivery opportunities</p>
              <Button 
                variant="outline"
                onClick={() => navigate('/register?role=delivery')}
              >
                Join as Rider
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
