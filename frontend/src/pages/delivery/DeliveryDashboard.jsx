import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import { FaMotorcycle, FaMapMarkerAlt, FaRupeeSign, FaStar } from 'react-icons/fa';
import './DeliveryPages.css';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  
  const stats = [
    { icon: <FaMotorcycle />, label: 'Deliveries Today', value: '0', color: 'red' },
    { icon: <FaRupeeSign />, label: 'Earnings', value: '₹0', color: 'orange' },
    { icon: <FaMapMarkerAlt />, label: 'Distance', value: '0 km', color: 'blue' },
    { icon: <FaStar />, label: 'Rating', value: '0.0', color: 'green' },
  ];

  return (
    <div className="delivery-dashboard">
      <div className="container">
        <div className="page-header">
          <h1>Delivery Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <Card key={index} className="stat-card" shadow="md">
              <div className={`stat-icon stat-icon-${stat.color}`}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
