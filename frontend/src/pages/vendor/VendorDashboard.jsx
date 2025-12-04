import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import { FaStore, FaUtensils, FaShoppingBag, FaChartLine } from 'react-icons/fa';
import './VendorPages.css';

const VendorDashboard = () => {
  const { user } = useAuth();
  
  const stats = [
    { icon: <FaShoppingBag />, label: 'Total Orders', value: '0', color: 'red' },
    { icon: <FaChartLine />, label: 'Revenue', value: '₹0', color: 'orange' },
    { icon: <FaUtensils />, label: 'Menu Items', value: '0', color: 'blue' },
    { icon: <FaStore />, label: 'Rating', value: '0.0', color: 'green' },
  ];

  return (
    <div className="vendor-dashboard">
      <div className="container">
        <div className="page-header">
          <h1>Vendor Dashboard</h1>
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

        <Card className="mt-4">
          <h3>Getting Started</h3>
          <p>Complete your restaurant profile and add menu items to start receiving orders.</p>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;
