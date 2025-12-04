# 🍽️ FoodHub Dashboard UI - Component Documentation

## 📋 Overview

A modern, fully responsive restaurant food ordering dashboard built with React and Tailwind CSS. Features a clean design with soft pastel colors, smooth animations, and intuitive user interactions.

**Live Route**: `/dashboard`

---

## 🏗️ Component Architecture

### Directory Structure
```
client/src/
├── components/
│   └── Dashboard.js           # All reusable UI components
├── sections/
│   └── DashboardSections.js   # Layout sections & containers
├── pages/
│   └── dashboard.jsx          # Main dashboard page with state
├── data/
│   └── static.js              # Dummy data & mock content
├── styles/
│   └── globals.css            # Global styles & animations
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS plugins
└── App.js                     # Main app with routing
```

---

## 📦 Component Breakdown

### 1. **TopNav Component**
Navigation bar at the top of the dashboard.

**Props:**
- `user` - User object with name, avatar, notifications
- `cartCount` - Number of items in cart
- `onCartClick` - Callback when cart icon clicked
- `onSearchChange` - Callback for search input changes

**Features:**
- Search bar with real-time input
- Notification badge with count
- Shopping cart icon with item count badge
- User profile section with avatar

```jsx
<TopNav
  user={user}
  cartCount={cart.length}
  onCartClick={() => setShowCart(!showCart)}
  onSearchChange={setSearchQuery}
/>
```

---

### 2. **Sidebar Component**
Fixed left navigation sidebar with logo and navigation icons.

**Features:**
- FoodHub branding/logo at top
- Navigation icons (Home, Favorites, History, Settings)
- Active state indication
- Logout button at bottom
- Gradient background (orange to white)

```jsx
<Sidebar />
```

---

### 3. **HeroBanner Component**
Large hero section with background image and CTA.

**Props:**
- `onCheckMenu` - Callback for "Check Menu" button

**Features:**
- Background image with overlay
- Greeting message (personalized with user name)
- "Deal of the weekend" badge
- "Check Menu" call-to-action button
- Gradient background with animations

```jsx
<HeroBanner onCheckMenu={() => setSelectedCategory(null)} />
```

---

### 4. **CategoryCard Component**
Individual category card with icon and label.

**Props:**
- `category` - Object with id, name, icon
- `isSelected` - Boolean indicating if selected
- `onClick` - Callback when clicked

**Features:**
- Icon display
- Selected state styling
- Hover scale animation
- Soft shadow effects

```jsx
<CategoryCard
  category={category}
  isSelected={selectedCategory === category.id}
  onClick={() => onSelectCategory(category.id)}
/>
```

---

### 5. **MenuItemCard Component**
Food item card with image, rating, name, and add to cart button.

**Props:**
- `item` - Food item object
- `onAddToCart` - Callback when add button clicked

**Features:**
- Product image with hover zoom
- Rating badge
- Item name and description
- Price display
- Add to cart button
- Smooth transitions

```jsx
<MenuItemCard
  item={item}
  onAddToCart={handleAddToCart}
/>
```

---

### 6. **CartItem Component**
Individual cart item in the cart sidebar.

**Props:**
- `item` - Food item object
- `quantity` - Current quantity
- `onIncrement` - Callback to increase quantity
- `onDecrement` - Callback to decrease quantity

**Features:**
- Item image thumbnail
- Item name and price
- Quantity controls (+ and -)
- Responsive layout

```jsx
<CartItem
  item={item}
  quantity={item.quantity}
  onIncrement={() => onIncrement(item.id)}
  onDecrement={() => onDecrement(item.id)}
/>
```

---

### 7. **TrendingCard Component**
Trending food item card.

**Props:**
- `item` - Trending item object

**Features:**
- Product image
- Item name
- Price
- Order count badge
- Hover animation

```jsx
<TrendingCard item={item} />
```

---

### 8. **CategoryTag Component**
Clickable category tag/filter button.

**Props:**
- `tag` - Tag string
- `isSelected` - Boolean indicating selection
- `onClick` - Callback when clicked

**Features:**
- Rounded pill shape
- Selected state styling
- Hover effects

```jsx
<CategoryTag
  tag={tag}
  isSelected={selectedTag === tag}
  onClick={() => onSelectTag(tag)}
/>
```

---

## 🎨 Section Components

### **CartSidebar Section**
Right-side fixed sidebar showing shopping cart summary.

**Features:**
- List of cart items
- Quantity controls for each item
- Subtotal, tax, and total calculations
- Checkout button
- Promo code input
- Empty state message

---

### **MenuSection Section**
Main content area showing recommended menu items.

**Features:**
- Grid layout (responsive columns)
- Filters by category
- Search functionality
- View All link
- No results message

---

### **TrendingSection Section**
Grid of trending/popular food items.

**Features:**
- 4-column grid (responsive)
- Order count badges
- Quick add to cart on click

---

### **CategoriesSection Section**
Horizontal category selection grid.

**Features:**
- All available categories
- Single selection mode
- Visual feedback

---

### **TagsSection Section**
Bottom-right fixed section with browseable category tags.

**Features:**
- Scrollable tag list
- Single selection mode
- Filter browsing

---

## 📊 Data Structure

### Menu Item Object
```javascript
{
  id: 1,
  name: 'Spaghetti Bolognese',
  category: 'Pizza',
  price: 12.99,
  rating: 4.8,
  image: 'url-to-image',
  description: 'Classic spaghetti with rich bolognese sauce',
  reviews: 128,
}
```

### Category Object
```javascript
{
  id: 1,
  name: 'Pizza',
  icon: '🍕',
}
```

### Cart Item Object
```javascript
{
  ...item,
  quantity: 1,
}
```

### User Object
```javascript
{
  name: 'Austine Robertson',
  avatar: 'url-to-avatar',
  notifications: 3,
}
```

---

## 🎯 State Management

The dashboard uses React's `useState` and `useMemo` hooks for state management:

```javascript
// Cart items with quantity
const [cart, setCart] = useState([]);

// Selected category filter
const [selectedCategory, setSelectedCategory] = useState(null);

// Selected category tag filter
const [selectedTag, setSelectedTag] = useState(null);

// Search query input
const [searchQuery, setSearchQuery] = useState('');

// Toggle cart sidebar visibility
const [showCart, setShowCart] = useState(false);

// Filtered items based on category and search
const filteredItems = useMemo(() => {
  return menuItems.filter(item => {
    const matchesCategory = selectedCategory === null || 
      item.category === categories.find(c => c.id === selectedCategory)?.name;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}, [selectedCategory, searchQuery]);
```

---

## 🎨 Color Palette

### Primary Colors
- **Orange**: `#FF8A00` (main brand color)
- **Light Orange**: `#FFF8F0` (background)
- **White**: `#FFFFFF`
- **Gray**: `#2D3748` (text)

### Tailwind Color Map
```javascript
orange: {
  50: '#FFF8F0',
  100: '#FFE4CC',
  200: '#FFC299',
  300: '#FFA366',
  400: '#FF8A00',
  500: '#FF7E00',
  600: '#E67E00',
  700: '#CC6600',
  800: '#994D00',
  900: '#663300',
}
```

---

## 🎬 Animations & Transitions

### Available Animations
1. **Hover Scale**: `hover:scale-105` - Items scale up on hover
2. **Fade In**: `animate-fadeIn` - Elements fade in on load
3. **Float**: `animate-float` - Smooth floating motion
4. **Pulse**: `animate-pulse` - Loading state
5. **Smooth Transitions**: `transition duration-300`

### Smooth Hover Effects
- Cards: `hover:shadow-lg transition`
- Buttons: `hover:scale-105 transition transform`
- Links: `hover:text-orange-600 transition`

---

## 📱 Responsive Design

### Breakpoints Used
- **sm**: 640px - Small tablets
- **md**: 768px - Tablets
- **lg**: 1024px - Desktops
- **xl**: 1280px - Large screens

### Grid Responsiveness
```javascript
// Menu items grid
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Trending items grid
grid-cols-2 md:grid-cols-3 lg:grid-cols-4

// Categories grid
grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7
```

---

## 🔄 User Interactions

### Add to Cart
```javascript
const handleAddToCart = (item) => {
  setCart((prevCart) => {
    const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      return prevCart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    }
    return [...prevCart, { ...item, quantity: 1 }];
  });
};
```

### Increment/Decrement Quantity
```javascript
const handleIncrement = (itemId) => {
  setCart(prevCart =>
    prevCart.map(item =>
      item.id === itemId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  );
};

const handleDecrement = (itemId) => {
  setCart(prevCart =>
    prevCart
      .map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
      .filter(item => item.quantity > 0)
  );
};
```

---

## 💳 Checkout & Payment

### Current Implementation
- Shows alert with cart summary
- Ready for API integration

### Future Integration
```javascript
const handleCheckout = async () => {
  // 1. Validate cart
  // 2. Validate user address
  // 3. Make payment API call
  // 4. Create order in database
  // 5. Clear cart
  // 6. Show order confirmation
};
```

---

## 🔌 API Integration Guide

### Environment Setup
```javascript
// .env.local
REACT_APP_API_URL=http://localhost:5000/api
```

### Create API Service
```javascript
// services/foodApi.js
export const fetchMenuItems = () =>
  fetch(`${process.env.REACT_APP_API_URL}/menu`)
    .then(res => res.json());

export const createOrder = (cartData) =>
  fetch(`${process.env.REACT_APP_API_URL}/order`, {
    method: 'POST',
    body: JSON.stringify(cartData),
  })
    .then(res => res.json());
```

### Replace Dummy Data
```javascript
// In dashboard.jsx
useEffect(() => {
  fetchMenuItems()
    .then(items => setMenuItems(items))
    .catch(error => console.error(error));
}, []);
```

---

## 🚀 Performance Optimizations

### Memoization
```javascript
const filteredItems = useMemo(() => {
  // Complex filtering logic
}, [selectedCategory, searchQuery]);
```

### Image Optimization
- Using Unsplash URLs (can be replaced with CDN)
- Lazy loading ready
- Responsive image sizes

### Code Splitting
- Dashboard page can be lazy loaded
- Components are modular for easy splitting

---

## 📦 Installation & Setup

### 1. Install Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configure Tailwind
Already configured in `tailwind.config.js`

### 3. Import Global Styles
```javascript
// In App.js
import './styles/globals.css';
```

### 4. Use Dashboard
```javascript
// In App.js routes
<Route path="/dashboard" element={<DashboardPage />} />
```

---

## 🎯 Testing the Dashboard

### Manual Testing Checklist
- [ ] Sidebar navigation works
- [ ] Search filters items
- [ ] Category selection filters menu
- [ ] Add to cart functionality
- [ ] Cart quantity controls work
- [ ] Checkout button shows alert
- [ ] Responsive on mobile/tablet/desktop
- [ ] Hover animations smooth
- [ ] Images load properly
- [ ] Cart sidebar appears/disappears

### Example Test Data
- Menu items: 8 items across 7 categories
- Trending items: 4 popular items
- Categories: Pizza, Fruits, Snacks, Veggies, Hotdog, Burger, Drink
- Tags: 10 browseable categories

---

## 🔧 Customization Guide

### Change Brand Color
```javascript
// tailwind.config.js
orange: {
  400: '#YOUR_COLOR', // Change this
}
```

### Add More Categories
```javascript
// data/static.js
export const categories = [
  // Add new category here
  { id: 8, name: 'Dessert', icon: '🍰' },
];
```

### Modify Cart Calculation
```javascript
// sections/DashboardSections.js - CartSidebar
const subtotal = cart.reduce(...);
const tax = subtotal * 0.15; // Change tax rate
```

---

## ⚠️ Known Limitations & Future Improvements

### Current Limitations
1. Static data (no API integration yet)
2. No user authentication on dashboard
3. Cart not persisted to localStorage
4. No order history

### Future Improvements
1. [ ] Backend API integration
2. [ ] Redux/Context for state management
3. [ ] Login/authentication flow
4. [ ] Persistent cart (localStorage)
5. [ ] Order history page
6. [ ] User profile page
7. [ ] Reviews and ratings system
8. [ ] Favorites/wishlist
9. [ ] Multiple payment methods
10. [ ] Delivery tracking

---

## 📞 Support & Troubleshooting

### Images Not Loading
- Check internet connection
- Unsplash URLs might be blocked
- Use local images or CDN instead

### Tailwind Classes Not Working
- Run `npm install -D tailwindcss`
- Check `tailwind.config.js` content paths
- Restart development server

### State Not Updating
- Check console for errors
- Verify callback functions are passed correctly
- Use React DevTools to debug state

---

## 📚 Additional Resources

### Tailwind CSS
- Documentation: https://tailwindcss.com/docs
- Color Customization: https://tailwindcss.com/docs/customizing-colors

### React
- Hooks: https://react.dev/reference/react
- Performance: https://react.dev/reference/react/useMemo

### Design Inspiration
- Component patterns: https://ui.shadcn.com
- Color palettes: https://colorhunt.co

---

## 📄 License

This dashboard UI component is part of the FoodHub project and follows the same ISC license.

---

**Status**: ✅ Production Ready

**Last Updated**: December 2024

**Version**: 1.0.0
