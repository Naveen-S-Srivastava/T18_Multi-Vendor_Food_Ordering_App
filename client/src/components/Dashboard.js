import React from 'react';

export const TopNav = ({ user, cartCount, onCartClick, onSearchChange }) => {
  return (
    <nav className="bg-white shadow-sm fixed top-0 right-0 left-64 h-20 z-40">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for food..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 bg-orange-50 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
            />
            <span className="absolute right-3 top-2.5 text-orange-400">🔍</span>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6 ml-8">
          {/* Notification */}
          <div className="relative cursor-pointer">
            <span className="text-2xl">🔔</span>
            {user.notifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {user.notifications}
              </span>
            )}
          </div>

          {/* Cart */}
          <div className="relative cursor-pointer" onClick={onCartClick}>
            <span className="text-2xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user.name.split(' ')[0]}</p>
              <p className="text-xs text-gray-500">Customer</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-orange-50 to-white shadow-lg z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍽️</span>
          <span className="text-xl font-bold text-orange-600">FoodHub</span>
        </div>
      </div>

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center gap-6 py-12">
        <NavIcon icon="🏠" label="Home" active={true} />
        <NavIcon icon="❤️" label="Favorites" />
        <NavIcon icon="⏰" label="History" />
        <NavIcon icon="⚙️" label="Settings" />
      </nav>

      {/* Logout */}
      <div className="pb-6 px-6">
        <button className="w-full py-2 text-gray-500 hover:text-orange-600 transition flex items-center justify-center gap-2">
          <span>🚪</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

const NavIcon = ({ icon, label, active = false }) => (
  <div className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition ${active ? 'bg-orange-100' : 'hover:bg-orange-50'}`}>
    <span className="text-2xl">{icon}</span>
    <span className={`text-xs font-medium ${active ? 'text-orange-600' : 'text-gray-600'}`}>{label}</span>
  </div>
);

export const HeroBanner = ({ onCheckMenu }) => {
  return (
    <div className="relative h-64 bg-gradient-to-r from-orange-400 to-orange-300 rounded-2xl overflow-hidden shadow-lg mb-8">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-40">
        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&fit=crop"
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-8">
        <div>
          <div className="inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold mb-4 backdrop-blur">
            🎉 Deal of the weekend
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Hello, Austine Robertson</h1>
          <p className="text-orange-50 text-lg">Explore delicious food from your favorite restaurants</p>
        </div>

        <button
          onClick={onCheckMenu}
          className="self-start bg-white text-orange-600 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition transform"
        >
          Check Menu →
        </button>
      </div>
    </div>
  );
};

export const CategoryCard = ({ category, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl text-center transition transform hover:scale-105 ${
        isSelected
          ? 'bg-orange-400 text-white shadow-lg'
          : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
      }`}
    >
      <span className="text-4xl block mb-2">{category.icon}</span>
      <span className="text-sm font-semibold">{category.name}</span>
    </button>
  );
};

export const MenuItemCard = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden group">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-1">
          <span className="text-yellow-400">⭐</span>
          <span className="font-bold text-gray-800">{item.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-xs text-gray-500 mb-3">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-600">${item.price}</span>
          <button
            onClick={() => onAddToCart(item)}
            className="bg-orange-400 text-white p-2 rounded-lg hover:bg-orange-500 transition transform hover:scale-110"
          >
            ➕
          </button>
        </div>
      </div>
    </div>
  );
};

export const CartItem = ({ item, quantity, onIncrement, onDecrement }) => {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-orange-100 last:border-b-0">
      <img
        src={item.image}
        alt={item.name}
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
        <p className="text-xs text-gray-500">${item.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrement}
          className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition text-sm"
        >
          −
        </button>
        <span className="w-4 text-center text-sm font-semibold">{quantity}</span>
        <button
          onClick={onIncrement}
          className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition text-sm"
        >
          +
        </button>
      </div>
    </div>
  );
};

export const TrendingCard = ({ item }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold">
          ⭡ {item.orders} orders
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-gray-800 mb-1">{item.name}</h4>
        <p className="text-lg font-bold text-orange-600">${item.price}</p>
      </div>
    </div>
  );
};

export const CategoryTag = ({ tag, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition transform hover:scale-105 ${
        isSelected
          ? 'bg-orange-400 text-white shadow-md'
          : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
      }`}
    >
      {tag}
    </button>
  );
};
