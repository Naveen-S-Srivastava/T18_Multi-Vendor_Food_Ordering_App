import React from 'react';
import { useParams } from 'react-router-dom';
import './CustomerPages.css';

const RestaurantDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="restaurant-detail-page">
      <div className="container">
        <h1>Restaurant Detail Page</h1>
        <p>Restaurant ID: {id}</p>
        <p>This page will show restaurant menu, info, and allow ordering.</p>
      </div>
    </div>
  );
};

export default RestaurantDetail;
