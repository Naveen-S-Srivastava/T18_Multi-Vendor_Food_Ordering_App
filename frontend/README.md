# Foodie - Multi-Vendor Food Ordering Platform

## 🎨 Color Palette

| Purpose        | Hex       | Usage                                    |
| -------------- | --------- | ---------------------------------------- |
| Primary Red    | #FF4E4E   | CTA buttons, highlights, appetizing energy |
| Accent Orange  | #FF8A00   | Ratings, badges, delivery state          |
| Primary Dark   | #1C1C1C   | Text, contrast against red/orange        |
| Card Grey      | #F7F7F7   | Menu backgrounds, cards                  |
| Border Grey    | #EAEAEA   | Subtle outlines                          |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend server running on `http://localhost:5000`

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Loading.jsx
│   │   └── layout/          # Layout components
│   │       ├── Header.jsx
│   │       └── Footer.jsx
│   ├── context/             # React Context
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/              # All pages
│   │   ├── auth/           # Login, Register
│   │   ├── customer/       # Customer pages
│   │   ├── vendor/         # Vendor dashboard
│   │   ├── delivery/       # Delivery partner pages
│   │   └── admin/          # Admin panel
│   ├── services/           # API services
│   │   └── api.js
│   ├── styles/            # Global styles
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Features

### ✅ Completed
- **Design System**: Complete color palette, typography, and utility classes
- **Authentication**: Login and Register pages with role selection
- **Layout Components**: Responsive Header and Footer
- **Common Components**: Button, Input, Card, Loading, Select, TextArea
- **Context Providers**: Auth and Cart context with full functionality
- **API Integration**: Complete API service layer
- **Routing**: Protected routes with role-based access control
- **Home Page**: Modern landing page with hero, features, and CTAs

### 🏗️ Page Templates Created

#### Customer Pages
- **RestaurantList**: Browse all restaurants with filters
- **RestaurantDetail**: View menu, ratings, and place orders
- **Cart**: Shopping cart with item management
- **Checkout**: Order placement with address selection
- **Orders**: Order history and tracking
- **OrderTracking**: Real-time order status
- **Profile**: User profile management

#### Vendor Pages
- **VendorDashboard**: Overview of restaurant performance
- **RestaurantManagement**: Create/edit restaurant details
- **MenuManagement**: Add/edit menu items and categories
- **VendorOrders**: Manage incoming orders

#### Delivery Pages
- **DeliveryDashboard**: Delivery partner stats
- **AvailableDeliveries**: Browse available orders
- **ActiveDeliveries**: Current delivery assignments
- **DeliveryHistory**: Past deliveries

#### Admin Pages
- **AdminDashboard**: Platform analytics
- **UserManagement**: Manage all users
- **AdminRestaurants**: Restaurant oversight
- **CouponManagement**: Create and manage coupons

## 🎨 Design Features

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### UI Components
All components follow the color palette and design guidelines:
- Consistent spacing and typography
- Smooth transitions and animations
- Accessibility-focused (WCAG compliant)
- Touch-friendly buttons (min 44x44px)

### Color Usage Guidelines
- **Primary Red (#FF4E4E)**: Main CTAs, active states, important highlights
- **Accent Orange (#FF8A00)**: Ratings (stars), badges, secondary actions
- **Primary Dark (#1C1C1C)**: Body text, headers
- **Card Grey (#F7F7F7)**: Card backgrounds, disabled states
- **Border Grey (#EAEAEA)**: Borders, dividers

## 🔧 Development

### API Configuration
The frontend is configured to proxy API requests to the backend:
- Base URL: `http://localhost:5000/api`
- Authentication: JWT Bearer tokens
- Automatic token injection via Axios interceptors

### State Management
- **AuthContext**: User authentication and profile
- **CartContext**: Shopping cart management
- **Local Storage**: Token and user data persistence

### Styling Approach
- **CSS Variables**: All colors and spacing defined as CSS custom properties
- **Utility Classes**: Flexbox, grid, spacing, typography helpers
- **Component Styles**: Scoped CSS files for each component
- **Global Styles**: Base styles, resets, and animations

## 📱 Key Pages Overview

### Home Page
- Hero section with animated food emojis
- Feature highlights
- Popular cuisines grid
- CTA sections for customers and partners

### Authentication
- Clean, centered forms
- Real-time validation
- Role selection during registration
- Responsive design

### Restaurant Pages
- Grid/list view toggle
- Advanced filters (cuisine, rating, delivery time)
- Search functionality
- Real-time availability

### Order Flow
1. Browse restaurants → 2. Add to cart → 3. Checkout → 4. Track order

## 🚦 Next Steps

To complete the frontend:

1. **Create remaining page components** (templates provided)
2. **Add more detailed features**:
   - Image uploads for restaurants/menu items
   - Real-time order tracking with Socket.IO
   - Payment gateway integration
   - Rating and review system
   - Notification system

3. **Testing**:
   - Component testing
   - Integration testing
   - E2E testing

4. **Optimization**:
   - Code splitting
   - Lazy loading
   - Image optimization
   - PWA features

## 🎯 Best Practices

- Keep components small and focused
- Use semantic HTML
- Follow accessibility guidelines
- Optimize images and assets
- Use loading states for async operations
- Handle errors gracefully
- Provide user feedback (toasts/notifications)

## 📦 Dependencies

### Core
- **React 18**: UI library
- **React Router 6**: Routing
- **Vite**: Build tool

### UI/UX
- **React Icons**: Icon library
- **React Toastify**: Notifications

### API
- **Axios**: HTTP client

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend server is running on port 5000
- Check CORS configuration
- Verify API endpoints match backend routes

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📄 License

This project was developed for Hackathon T18.

## 👥 Support

For issues or questions, refer to the backend API documentation or create an issue in the repository.

---

**Happy Coding! 🚀**
