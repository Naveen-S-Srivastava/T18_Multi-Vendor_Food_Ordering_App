import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RestaurantList from './pages/customer/RestaurantList';
import RestaurantDetail from './pages/customer/RestaurantDetail';

// Customer Pages
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import OrderTracking from './pages/customer/OrderTracking';
import Profile from './pages/customer/Profile';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import RestaurantManagement from './pages/vendor/RestaurantManagement';
import MenuManagement from './pages/vendor/MenuManagement';
import VendorOrders from './pages/vendor/VendorOrders';

// Delivery Pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import AvailableDeliveries from './pages/delivery/AvailableDeliveries';
import ActiveDeliveries from './pages/delivery/ActiveDeliveries';
import DeliveryHistory from './pages/delivery/DeliveryHistory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminRestaurants from './pages/admin/AdminRestaurants';
import CouponManagement from './pages/admin/CouponManagement';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CartProvider>
          <div className="app-container">
            <Header />
            <main style={{ minHeight: 'calc(100vh - 180px)' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/restaurants" element={<RestaurantList />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                
                {/* Customer Routes */}
                <Route path="/cart" element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/order/:id" element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <OrderTracking />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                {/* Vendor Routes */}
                <Route path="/vendor/dashboard" element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <VendorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/vendor/restaurant" element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <RestaurantManagement />
                  </ProtectedRoute>
                } />
                <Route path="/vendor/menu" element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <MenuManagement />
                  </ProtectedRoute>
                } />
                <Route path="/vendor/orders" element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <VendorOrders />
                  </ProtectedRoute>
                } />
                
                {/* Delivery Routes */}
                <Route path="/delivery/dashboard" element={
                  <ProtectedRoute allowedRoles={['delivery']}>
                    <DeliveryDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/delivery/available" element={
                  <ProtectedRoute allowedRoles={['delivery']}>
                    <AvailableDeliveries />
                  </ProtectedRoute>
                } />
                <Route path="/delivery/active" element={
                  <ProtectedRoute allowedRoles={['delivery']}>
                    <ActiveDeliveries />
                  </ProtectedRoute>
                } />
                <Route path="/delivery/history" element={
                  <ProtectedRoute allowedRoles={['delivery']}>
                    <DeliveryHistory />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/restaurants" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminRestaurants />
                  </ProtectedRoute>
                } />
                <Route path="/admin/coupons" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <CouponManagement />
                  </ProtectedRoute>
                } />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
