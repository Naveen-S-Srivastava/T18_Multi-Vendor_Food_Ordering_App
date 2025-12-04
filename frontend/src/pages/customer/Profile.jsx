import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import './CustomerPages.css';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>

        <Card>
          <h3>Personal Information</h3>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
