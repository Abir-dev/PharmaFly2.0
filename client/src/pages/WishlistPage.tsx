import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2, Eye } from 'lucide-react';

// Mock wishlist data
const mockWishlistItems = [
  {
    id: 1,
    name: 'Digital Blood Pressure Monitor',
    price: 89.99,
    originalPrice: 129.99,
    image: '/blood.jpg',
    category: 'Monitoring Devices',
    rating: 4.5,
    reviews: 128,
    inStock: true,
    description: 'Professional-grade blood pressure monitor with digital display and memory function.'
  },
  {
    id: 2,
    name: 'Premium Stethoscope',
    price: 149.99,
    originalPrice: 199.99,
    image: '/drone.jpg',
    category: 'Medical Equipment',
    rating: 4.8,
    reviews: 89,
    inStock: true,
    description: 'High-quality stethoscope for medical professionals with excellent acoustic performance.'
  },
  {
    id: 3,
    name: 'Smart Pulse Oximeter',
    price: 79.99,
    originalPrice: 99.99,
    image: '/drone2.jpg',
    category: 'Monitoring Devices',
    rating: 4.3,
    reviews: 156,
    inStock: false,
    description: 'Bluetooth-enabled pulse oximeter with smartphone connectivity and data tracking.'
  },
  {
    id: 4,
    name: 'Portable ECG Monitor',
    price: 299.99,
    originalPrice: 399.99,
    image: '/drone3.jpg',
    category: 'Monitoring Devices',
    rating: 4.7,
    reviews: 67,
    inStock: true,
    description: 'Compact ECG monitor for home use with professional-grade accuracy.'
  },
  {
    id: 5,
    name: 'Digital Thermometer Pro',
    price: 39.99,
    originalPrice: 59.99,
    image: '/drone5.jpg',
    category: 'Basic Care',
    rating: 4.4,
    reviews: 234,
    inStock: true,
    description: 'Fast and accurate digital thermometer with backlit display and fever alert.'
  }
];

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(wishlistItems.map(item => item.category)))];

  const filteredItems = wishlistItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const moveToCart = (id: number) => {
    // TODO: Implement move to cart functionality
    console.log('Moving item to cart:', id);
    removeFromWishlist(id);
  };

  const viewProduct = (id: number) => {
    navigate(`/product/${id}`);
  };

  const totalSavings = wishlistItems.reduce((total, item) => {
    return total + (item.originalPrice - item.price);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03045E] via-[#023E8A] to-[#0077B6] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-[#CAF0F8] hover:text-white transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-[#CAF0F8]">My Wishlist</h1>
          </div>
          <div className="text-right">
            <p className="text-[#CAF0F8] text-lg">{wishlistItems.length} items</p>
            <p className="text-green-400 text-sm">Save ${totalSavings.toFixed(2)}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Items</p>
                <p className="text-2xl font-bold text-[#CAF0F8]">{wishlistItems.length}</p>
              </div>
              <Heart className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">In Stock</p>
                <p className="text-2xl font-bold text-[#CAF0F8]">{wishlistItems.filter(item => item.inStock).length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Out of Stock</p>
                <p className="text-2xl font-bold text-[#CAF0F8]">{wishlistItems.filter(item => !item.inStock).length}</p>
              </div>
              <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-[#CAF0F8]">${wishlistItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-[#00B4D8] to-[#48CAE4] rounded-full flex items-center justify-center">
                <span className="text-[#03045E] text-xs font-bold">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#00B4D8] to-[#48CAE4] text-[#03045E]'
                    : 'text-[#CAF0F8] hover:bg-white/10'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Wishlist Items */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  {!item.inStock && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-[#CAF0F8] text-sm ml-1">{item.rating}</span>
                      <span className="text-gray-400 text-xs ml-1">({item.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-[#CAF0F8] mb-2 line-clamp-2">
                    {item.name}
                  </h3>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-[#CAF0F8]">${item.price}</span>
                      <span className="text-gray-400 line-through text-sm">${item.originalPrice}</span>
                    </div>
                    <span className="text-green-400 text-sm font-medium">
                      Save ${(item.originalPrice - item.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewProduct(item.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-white/10 text-[#CAF0F8] rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => moveToCart(item.id)}
                      disabled={!item.inStock}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-[#00B4D8] to-[#48CAE4] text-[#03045E] rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#CAF0F8] mb-2">Your wishlist is empty</h3>
            <p className="text-gray-400 mb-6">Start adding products you love to your wishlist</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-gradient-to-r from-[#00B4D8] to-[#48CAE4] text-[#03045E] rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage; 