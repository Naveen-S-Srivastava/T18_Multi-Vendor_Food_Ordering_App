add # Team Commit Execution Script
# Run this script section by section for each team member

Write-Host "=== T18 Multi-Vendor Food Ordering App - Team Commit Script ===" -ForegroundColor Cyan
Write-Host ""

# ============================================
# MEMBER 1: whoisyashu (Backend - Auth & Cart)
# ============================================

Write-Host "MEMBER 1: whoisyashu" -ForegroundColor Yellow
Write-Host "Files: User, Auth, Cart, Payment" -ForegroundColor Green
Write-Host ""
Write-Host "Commands to run:" -ForegroundColor Cyan
Write-Host @"
# Commit 1: User Model
git checkout -b feature-whoisyashu-user-model
git add backend/models/User.js
git commit -m "feat: implement User model with role-based authentication"
git push origin feature-whoisyashu-user-model

# Commit 2: Auth Controller
git checkout main
git pull origin main
git checkout -b feature-whoisyashu-auth-controller
git add backend/controllers/authController.js
git commit -m "feat: create authentication controller with JWT"
git push origin feature-whoisyashu-auth-controller

# Commit 3: Auth Routes & Middleware
git checkout main
git pull origin main
git checkout -b feature-whoisyashu-auth-routes
git add backend/routes/authRoutes.js backend/middleware/auth.js
git commit -m "feat: implement auth routes and JWT middleware"
git push origin feature-whoisyashu-auth-routes

# Commit 4: User Routes
git checkout main
git pull origin main
git checkout -b feature-whoisyashu-user-routes
git add backend/routes/userRoutes.js backend/controllers/userController.js
git commit -m "feat: add user management routes and controller"
git push origin feature-whoisyashu-user-routes

# Commit 5: Cart Model
git checkout main
git pull origin main
git checkout -b feature-whoisyashu-cart-model
git add backend/models/Cart.js
git commit -m "feat: create Cart model with multi-vendor support"
git push origin feature-whoisyashu-cart-model

# Commit 6: Cart Controller
git checkout main
git pull origin main
git checkout -b feature-whoisyashu-cart-controller
git add backend/controllers/cartController.js
git commit -m "feat: implement cart CRUD operations"
git push origin feature-whoisyashu-cart-controller

# Commit 7: Cart Routes
git checkout main
git pull origin main
git checkout -b feature-whoisyashu-cart-routes
git add backend/routes/cartRoutes.js
git commit -m "feat: add cart API routes with coupon support"
git push origin feature-whoisyashu-cart-routes

# Commit 8: Payment Service
git checkout main
git pull origin main
git checkout -b feature-whoisyashu-payment-service
git add backend/services/paymentService.js
git commit -m "feat: integrate Razorpay payment gateway"
git push origin feature-whoisyashu-payment-service

# Commit 9: Payment Controller & Routes
git checkout main
git pull origin main
git checkout -b feature-whoisyashu-payment-api
git add backend/controllers/paymentController.js backend/routes/paymentRoutes.js
git commit -m "feat: implement payment API with verification"
git push origin feature-whoisyashu-payment-api

# Commit 10: Socket Helper
git checkout main
git pull origin main
git checkout -b feature-whoisyashu-socket-helper
git add backend/utils/socketHelper.js
git commit -m "feat: create Socket.io helper for real-time updates"
git push origin feature-whoisyashu-socket-helper

"@ -ForegroundColor White

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# MEMBER 2: Naveen-S-Srivastava (Backend - Restaurant & Orders)
# ============================================

Write-Host "MEMBER 2: Naveen-S-Srivastava" -ForegroundColor Yellow
Write-Host "Files: Restaurant, Menu, Orders, Delivery" -ForegroundColor Green
Write-Host ""
Write-Host "Commands to run:" -ForegroundColor Cyan
Write-Host @"
# Commit 1: Restaurant Model
git checkout -b feature-naveen-restaurant-model
git add backend/models/Restaurant.js
git commit -m "feat: create Restaurant model with geolocation indexing"
git push origin feature-naveen-restaurant-model

# Commit 2: Restaurant Controller
git checkout main
git pull origin main
git checkout -b feature-naveen-restaurant-controller
git add backend/controllers/restaurantController.js
git commit -m "feat: implement restaurant CRUD with search filters"
git push origin feature-naveen-restaurant-controller

# Commit 3: Restaurant Routes
git checkout main
git pull origin main
git checkout -b feature-naveen-restaurant-routes
git add backend/routes/restaurantRoutes.js
git commit -m "feat: add restaurant API routes with vendor access"
git push origin feature-naveen-restaurant-routes

# Commit 4: MenuItem Model
git checkout main
git pull origin main
git checkout -b feature-naveen-menu-model
git add backend/models/MenuItem.js
git commit -m "feat: create MenuItem model with categories"
git push origin feature-naveen-menu-model

# Commit 5: Menu Controller
git checkout main
git pull origin main
git checkout -b feature-naveen-menu-controller
git add backend/controllers/menuController.js
git commit -m "feat: implement menu management controller"
git push origin feature-naveen-menu-controller

# Commit 6: Menu Routes
git checkout main
git pull origin main
git checkout -b feature-naveen-menu-routes
git add backend/routes/menuRoutes.js
git commit -m "feat: add menu API with availability toggle"
git push origin feature-naveen-menu-routes

# Commit 7: Order Model
git checkout main
git pull origin main
git checkout -b feature-naveen-order-model
git add backend/models/Order.js
git commit -m "feat: create Order model with status tracking"
git push origin feature-naveen-order-model

# Commit 8: Order Controller
git checkout main
git pull origin main
git checkout -b feature-naveen-order-controller
git add backend/controllers/orderController.js
git commit -m "feat: implement order lifecycle management"
git push origin feature-naveen-order-controller

# Commit 9: Order & Delivery Routes
git checkout main
git pull origin main
git checkout -b feature-naveen-delivery-system
git add backend/routes/orderRoutes.js backend/routes/deliveryRoutes.js backend/controllers/deliveryController.js
git commit -m "feat: add order and delivery management APIs"
git push origin feature-naveen-delivery-system

# Commit 10: Map Utilities
git checkout main
git pull origin main
git checkout -b feature-naveen-map-utils
git add backend/utils/mapHelper.js
git commit -m "feat: implement distance calculation and delivery zones"
git push origin feature-naveen-map-utils

# Commit 11: Review System
git checkout main
git pull origin main
git checkout -b feature-naveen-review-system
git add backend/models/Review.js backend/controllers/reviewController.js backend/routes/reviewRoutes.js
git commit -m "feat: implement review and rating system"
git push origin feature-naveen-review-system

# Commit 12: Coupon System
git checkout main
git pull origin main
git checkout -b feature-naveen-coupon-system
git add backend/models/Coupon.js backend/controllers/couponController.js backend/routes/couponRoutes.js
git commit -m "feat: add coupon management system"
git push origin feature-naveen-coupon-system

"@ -ForegroundColor White

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# MEMBER 3: yashraj-03 (Frontend - Auth & Customer)
# ============================================

Write-Host "MEMBER 3: yashraj-03" -ForegroundColor Yellow
Write-Host "Files: Auth Pages, Home, Customer Pages, Services" -ForegroundColor Green
Write-Host ""
Write-Host "Commands to run:" -ForegroundColor Cyan
Write-Host @"
# Commit 1: Auth Context
git checkout -b feature-yashraj-auth-context
git add frontend/src/context/AuthContext.jsx
git commit -m "feat: create AuthContext with JWT integration"
git push origin feature-yashraj-auth-context

# Commit 2: Cart Context
git checkout main
git pull origin main
git checkout -b feature-yashraj-cart-context
git add frontend/src/context/CartContext.jsx
git commit -m "feat: implement CartContext with state management"
git push origin feature-yashraj-cart-context

# Commit 3: API Service
git checkout main
git pull origin main
git checkout -b feature-yashraj-api-service
git add frontend/src/services/api.js
git commit -m "feat: setup Axios API service with interceptors"
git push origin feature-yashraj-api-service

# Commit 4: Socket Service
git checkout main
git pull origin main
git checkout -b feature-yashraj-socket-service
git add frontend/src/services/socket.js
git commit -m "feat: create Socket.io client service"
git push origin feature-yashraj-socket-service

# Commit 5: Login Page
git checkout main
git pull origin main
git checkout -b feature-yashraj-login-page
git add frontend/src/pages/auth/Login.jsx
git commit -m "feat: create login page with form validation"
git push origin feature-yashraj-login-page

# Commit 6: Register Page
git checkout main
git pull origin main
git checkout -b feature-yashraj-register-page
git add frontend/src/pages/auth/Register.jsx frontend/src/pages/auth/Auth.css
git commit -m "feat: implement registration page with role selection"
git push origin feature-yashraj-register-page

# Commit 7: Home Page
git checkout main
git pull origin main
git checkout -b feature-yashraj-home-page
git add frontend/src/pages/Home.jsx frontend/src/pages/Home.css
git commit -m "style: design home page with hero and features"
git push origin feature-yashraj-home-page

# Commit 8: Restaurant List
git checkout main
git pull origin main
git checkout -b feature-yashraj-restaurant-list
git add frontend/src/pages/customer/RestaurantList.jsx
git commit -m "feat: implement restaurant listing with filters"
git push origin feature-yashraj-restaurant-list

# Commit 9: Cart Page
git checkout main
git pull origin main
git checkout -b feature-yashraj-cart-page
git add frontend/src/pages/customer/Cart.jsx
git commit -m "feat: create shopping cart with quantity controls"
git push origin feature-yashraj-cart-page

# Commit 10: Orders Page
git checkout main
git pull origin main
git checkout -b feature-yashraj-orders-page
git add frontend/src/pages/customer/Orders.jsx
git commit -m "feat: implement order history with status tracking"
git push origin feature-yashraj-orders-page

# Commit 11: Customer Pages Styling
git checkout main
git pull origin main
git checkout -b feature-yashraj-customer-styles
git add frontend/src/pages/customer/CustomerPages.css frontend/src/pages/customer/RestaurantDetail.jsx frontend/src/pages/customer/Checkout.jsx frontend/src/pages/customer/OrderTracking.jsx frontend/src/pages/customer/Profile.jsx
git commit -m "style: add responsive styles for customer pages"
git push origin feature-yashraj-customer-styles

"@ -ForegroundColor White

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# MEMBER 4: pankitjain-gif (Frontend - Components & Dashboards)
# ============================================

Write-Host "MEMBER 4: pankitjain-gif" -ForegroundColor Yellow
Write-Host "Files: Components, Layout, Dashboards, App Router" -ForegroundColor Green
Write-Host ""
Write-Host "Commands to run:" -ForegroundColor Cyan
Write-Host @"
# Commit 1: Button Component
git checkout -b feature-pankitjain-button-component
git add frontend/src/components/common/Button.jsx frontend/src/components/common/Button.css
git commit -m "feat: create reusable Button component with variants"
git push origin feature-pankitjain-button-component

# Commit 2: Input Component
git checkout main
git pull origin main
git checkout -b feature-pankitjain-input-component
git add frontend/src/components/common/Input.jsx frontend/src/components/common/Input.css
git commit -m "feat: create Input component with validation"
git push origin feature-pankitjain-input-component

# Commit 3: Card & Loading Components
git checkout main
git pull origin main
git checkout -b feature-pankitjain-card-loading
git add frontend/src/components/common/Card.jsx frontend/src/components/common/Card.css frontend/src/components/common/Loading.jsx frontend/src/components/common/Loading.css
git commit -m "feat: implement Card and Loading components"
git push origin feature-pankitjain-card-loading

# Commit 4: Header Component
git checkout main
git pull origin main
git checkout -b feature-pankitjain-header
git add frontend/src/components/layout/Header.jsx frontend/src/components/layout/Header.css
git commit -m "feat: create responsive Header with navigation"
git push origin feature-pankitjain-header

# Commit 5: Footer Component
git checkout main
git pull origin main
git checkout -b feature-pankitjain-footer
git add frontend/src/components/layout/Footer.jsx frontend/src/components/layout/Footer.css
git commit -m "feat: implement Footer with social links"
git push origin feature-pankitjain-footer

# Commit 6: Global Styles
git checkout main
git pull origin main
git checkout -b feature-pankitjain-global-styles
git add frontend/src/styles/global.css
git commit -m "style: implement global design system with color palette"
git push origin feature-pankitjain-global-styles

# Commit 7: App Router
git checkout main
git pull origin main
git checkout -b feature-pankitjain-app-routing
git add frontend/src/App.jsx frontend/src/main.jsx
git commit -m "feat: setup React Router with protected routes"
git push origin feature-pankitjain-app-routing

# Commit 8: Vendor Dashboard
git checkout main
git pull origin main
git checkout -b feature-pankitjain-vendor-dashboard
git add frontend/src/pages/vendor/VendorDashboard.jsx frontend/src/pages/vendor/VendorPages.css
git commit -m "feat: create Vendor Dashboard with stats"
git push origin feature-pankitjain-vendor-dashboard

# Commit 9: Vendor Pages
git checkout main
git pull origin main
git checkout -b feature-pankitjain-vendor-pages
git add frontend/src/pages/vendor/RestaurantManagement.jsx frontend/src/pages/vendor/MenuManagement.jsx frontend/src/pages/vendor/VendorOrders.jsx
git commit -m "feat: implement vendor management pages"
git push origin feature-pankitjain-vendor-pages

# Commit 10: Delivery Dashboard
git checkout main
git pull origin main
git checkout -b feature-pankitjain-delivery-dashboard
git add frontend/src/pages/delivery/DeliveryDashboard.jsx frontend/src/pages/delivery/DeliveryPages.css
git commit -m "feat: create Delivery Partner Dashboard"
git push origin feature-pankitjain-delivery-dashboard

# Commit 11: Delivery Pages
git checkout main
git pull origin main
git checkout -b feature-pankitjain-delivery-pages
git add frontend/src/pages/delivery/AvailableDeliveries.jsx frontend/src/pages/delivery/ActiveDeliveries.jsx frontend/src/pages/delivery/DeliveryHistory.jsx
git commit -m "feat: implement delivery management pages"
git push origin feature-pankitjain-delivery-pages

# Commit 12: Admin Dashboard
git checkout main
git pull origin main
git checkout -b feature-pankitjain-admin-dashboard
git add frontend/src/pages/admin/AdminDashboard.jsx frontend/src/pages/admin/AdminPages.css
git commit -m "feat: create Admin Dashboard with analytics"
git push origin feature-pankitjain-admin-dashboard

# Commit 13: Admin Pages
git checkout main
git pull origin main
git checkout -b feature-pankitjain-admin-pages
git add frontend/src/pages/admin/UserManagement.jsx frontend/src/pages/admin/AdminRestaurants.jsx frontend/src/pages/admin/CouponManagement.jsx
git commit -m "feat: implement admin management pages"
git push origin feature-pankitjain-admin-pages

"@ -ForegroundColor White

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ COMMIT STRATEGY READY!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Each member runs their section of commands"
Write-Host "2. Create Pull Request after each commit"
Write-Host "3. Assign 2 reviewers to each PR"
Write-Host "4. Review and approve PRs"
Write-Host "5. Team Lead merges approved PRs"
Write-Host ""
Write-Host "📊 Expected Results:" -ForegroundColor Yellow
Write-Host "- whoisyashu: 10 commits"
Write-Host "- Naveen-S-Srivastava: 12 commits"
Write-Host "- yashraj-03: 11 commits"
Write-Host "- pankitjain-gif: 13 commits"
Write-Host "- Total: 46 commits across 4 team members"
Write-Host ""
Write-Host "Good luck! 🎉" -ForegroundColor Cyan
