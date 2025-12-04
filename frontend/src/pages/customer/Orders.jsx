import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import './CustomerPages.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="empty-orders">
            <h3>No orders yet</h3>
            <p>Start ordering delicious food from your favorite restaurants</p>
            <Button variant="primary" onClick={() => navigate('/restaurants')}>
              Browse Restaurants
            </Button>
          </Card>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <Card key={order._id} className="order-card" shadow="md">
                <div className="order-header">
                  <span className="order-id">Order #{order.orderNumber}</span>
                  <span className={`order-status status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-items">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <span className="order-total">₹{order.pricing?.totalAmount}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Track Order
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
