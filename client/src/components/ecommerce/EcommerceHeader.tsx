import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils';

const EcommerceHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
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
        <div
          className="pharma-avatar-placeholder clickable"
          onClick={() => navigate('/login')}
          tabIndex={0}
          role="button"
          aria-label={user ? 'User menu' : 'Sign in'}
        >
          {user && user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            />
          ) : user && user.full_name ? (
            getInitials(user.full_name)
          ) : (
            'A'
          )}
        </div>
        <Link to="/cart" className="relative p-2 hover:text-[#00B4D8] transition-colors">
          <ShoppingCart className="h-7 w-7" />
        </Link>
      </div>
    </header>
  );
};

export default EcommerceHeader; 