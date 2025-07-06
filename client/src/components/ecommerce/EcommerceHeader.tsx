import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Settings, Package, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { getInitials } from '../../utils';

const EcommerceHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, signOut } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <header className="pharma-header w-full">
      <div className="pharma-header-left">
        <Link to="/" className="pharma-logo-center">
          <img src="/drone.png" alt="Logo" className="pharma-logo-center-img" />
          <span className="pharma-logo-center-text">PharmaFly</span>
        </Link>
      </div>
      {/* Center: Search Bar (full width between left and right) */}
      <form onSubmit={handleSearch} className="flex-1 flex justify-center mx-4">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 text-sm text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </form>
      {/* Right: Avatar + Cart */}
      <div className="pharma-header-right">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <div
              className="pharma-avatar-placeholder clickable"
              onClick={() => setShowDropdown(!showDropdown)}
              tabIndex={0}
              role="button"
              aria-label="User menu"
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                />
              ) : (
                getInitials(user.full_name)
              )}
            </div>
            
            {/* User Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-[#00B4D8] rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-[#CAF0F8]">{user.full_name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#CAF0F8] transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#CAF0F8] transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#CAF0F8] transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#CAF0F8] transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="pharma-avatar-placeholder clickable"
            onClick={() => navigate('/login')}
            tabIndex={0}
            role="button"
            aria-label="Sign in"
          >
            A
          </div>
        )}
        
        <Link to="/cart" className="relative p-2 hover:text-[#00B4D8] transition-colors">
          <ShoppingCart className="h-7 w-7" />
          {getCartItemCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getCartItemCount() > 99 ? '99+' : getCartItemCount()}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default EcommerceHeader; 