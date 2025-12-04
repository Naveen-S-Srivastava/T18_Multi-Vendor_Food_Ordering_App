import React, { useState, useMemo } from 'react';
import {
  TopNav,
  Sidebar,
  HeroBanner,
} from '../components/Dashboard';
import {
  CartSidebar,
  MenuSection,
  TrendingSection,
  CategoriesSection,
  TagsSection,
} from '../sections/DashboardSections';
import {
  categories,
  menuItems,
  trendingItems,
  cartTags,
  user,
} from '../data/static';

export default function DashboardPage() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);

  // Filter menu items based on category and search
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === null || item.category === categories.find(c => c.id === selectedCategory)?.name;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle add to cart
  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // Handle increment quantity
  const handleIncrement = (itemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Handle decrement quantity
  const handleDecrement = (itemId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Handle checkout
  const handleCheckout = () => {
    alert(`Checkout with ${cart.length} items for $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`);
    // Integrate with payment API later
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Top Navigation */}
      <TopNav
        user={user}
        cartCount={cart.length}
        onCartClick={() => setShowCart(!showCart)}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <main className={`ml-64 pt-24 pb-24 px-8 transition-all duration-300 ${showCart ? 'mr-96' : 'mr-0'}`}>
        {/* Hero Banner */}
        <HeroBanner onCheckMenu={() => setSelectedCategory(null)} />

        {/* Categories Section */}
        <CategoriesSection
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Menu Section */}
        <MenuSection
          selectedCategory={selectedCategory}
          items={menuItems}
          filteredItems={filteredItems}
          onAddToCart={handleAddToCart}
        />

        {/* Trending Section */}
        <TrendingSection
          trendingItems={trendingItems}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <CartSidebar
          cart={cart}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onCheckout={handleCheckout}
        />
      )}

      {/* Tags Section - Bottom Right */}
      <TagsSection
        tags={cartTags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
      />
    </div>
  );
}
