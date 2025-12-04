import React from 'react';
import { CartItem } from '../components/Dashboard';

export const CartSidebar = ({ cart, onIncrement, onDecrement, onCheckout }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <aside className="fixed right-0 top-20 w-80 h-[calc(100vh-80px)] bg-white shadow-xl overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Cart</h2>

        {cart.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-400 text-lg mb-2">🛒</p>
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-2 mb-6">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  quantity={item.quantity}
                  onIncrement={() => onIncrement(item.id)}
                  onDecrement={() => onDecrement(item.id)}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="border-t-2 border-orange-100 my-4"></div>

            {/* Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 bg-orange-50 p-3 rounded-lg">
                <span>Total</span>
                <span className="text-orange-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition transform"
            >
              Checkout →
            </button>

            {/* Promo Code */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter promo code"
                className="w-full px-4 py-2 border border-orange-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export const MenuSection = ({ selectedCategory, items, filteredItems, onAddToCart }) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recommended</h2>
        <a href="#" className="text-orange-500 font-semibold text-sm hover:text-orange-600">
          View All →
        </a>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No items found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden group"
            >
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
                  <div>
                    <span className="text-xl font-bold text-orange-600">${item.price}</span>
                    <p className="text-xs text-gray-400">({item.reviews} reviews)</p>
                  </div>
                  <button
                    onClick={() => onAddToCart(item)}
                    className="bg-orange-400 text-white p-2 rounded-lg hover:bg-orange-500 transition transform hover:scale-110"
                  >
                    ➕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export const TrendingSection = ({ trendingItems, onAddToCart }) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Trending Orders</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {trendingItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105 cursor-pointer group"
            onClick={() => onAddToCart(item)}
          >
            <div className="relative h-40 bg-gray-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute bottom-2 right-2 bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                ⭡ {item.orders}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-800 mb-1 text-sm">{item.name}</h4>
              <p className="text-lg font-bold text-orange-600">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const CategoriesSection = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`p-6 rounded-2xl text-center transition transform hover:scale-105 ${
              selectedCategory === category.id
                ? 'bg-orange-400 text-white shadow-lg'
                : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
            }`}
          >
            <span className="text-4xl block mb-2">{category.icon}</span>
            <span className="text-sm font-semibold">{category.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export const TagsSection = ({ tags, selectedTag, onSelectTag }) => {
  return (
    <section className="fixed right-0 bottom-0 w-80 h-96 bg-white shadow-xl p-6 rounded-t-3xl border-t-2 border-orange-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Browse Categories</h3>
      <div className="flex flex-wrap gap-3 overflow-y-auto h-80">
        {tags.map((tag, index) => (
          <button
            key={index}
            onClick={() => onSelectTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition transform hover:scale-105 whitespace-nowrap ${
              selectedTag === tag
                ? 'bg-orange-400 text-white shadow-md'
                : 'bg-orange-50 text-gray-700 hover:bg-orange-100'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
};
