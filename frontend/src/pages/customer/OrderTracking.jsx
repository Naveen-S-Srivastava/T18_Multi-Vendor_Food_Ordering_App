import React from 'react';
import { useParams } from 'react-router-dom';
import './CustomerPages.css';

const OrderTracking = () => {
  const { id } = useParams();
  
  return (
    <div className="order-tracking-page">
      <div className="container">
        <h1>Order Tracking</h1>
        <p>Track your order: {id}</p>
        <p>Real-time order status and delivery tracking will be shown here</p>
      </div>
    </div>
  );
};

export default OrderTracking;
