import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import { FaUsers, FaStore, FaShoppingBag, FaRupeeSign } from 'react-icons/fa';
import './AdminPages.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  const stats = [
    { icon: <FaUsers />, label: 'Total Users', value: '0', color: 'red' },
    { icon: <FaStore />, label: 'Restaurants', value: '0', color: 'orange' },
    { icon: <FaShoppingBag />, label: 'Orders', value: '0', color: 'blue' },
    { icon: <FaRupeeSign />, label: 'Revenue', value: '₹0', color: 'green' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Platform Overview</p>
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

export default AdminDashboard;
