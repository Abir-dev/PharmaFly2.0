import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Settings, LogOut, ShoppingBag, Heart, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'A';

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

  const handleLogout = async () => {
    await signOut();
    setShowDropdown(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate('/profile');
  };

  const handleOrdersClick = () => {
    setShowDropdown(false);
    navigate('/orders');
  };

  const handleWishlistClick = () => {
    setShowDropdown(false);
    navigate('/wishlist');
  };

  const handleSettingsClick = () => {
    setShowDropdown(false);
    navigate('/settings');
  };

  return (
    <header className="pharma-header">
      <div className="pharma-header-left">
        <div className="pharma-logo-center">
          <img src="/drone.png" alt="Logo" className="pharma-logo-center-img" />
          <span className="pharma-logo-center-text">PharmaFly</span>
        </div>
      </div>
      <div className="pharma-header-right">
        <div className="relative" ref={dropdownRef}>
          <div
            className={`pharma-avatar-placeholder clickable transition-all duration-200 ${
              showDropdown ? 'ring-2 ring-[#00B4D8] ring-opacity-50' : ''
            }`}
            onClick={() => {
              if (!user) navigate('/login');
              else setShowDropdown(!showDropdown);
            }}
            tabIndex={0}
            role="button"
            aria-label={user ? 'User menu' : 'Sign in'}
          >
            {user && user.avatar_url ? (
              <img src={user.avatar_url} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : user && user.full_name ? (
              initials
            ) : (
              'A'
            )}
            {user && (
              <ChevronDown 
                className={`absolute -bottom-1 -right-1 w-4 h-4 bg-[#00B4D8] text-[#03045E] rounded-full p-0.5 transition-transform duration-200 ${
                  showDropdown ? 'rotate-180' : ''
                }`} 
              />
            )}
          </div>
          
          {showDropdown && user && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-gradient-to-b from-gray-900/95 to-gray-800/95 border border-[#00B4D8]/20 rounded-lg shadow-xl z-50 backdrop-blur-md">
              {/* Header with gradient */}
              <div className="relative p-4 border-b border-gray-700/30">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00B4D8]/5 to-[#48CAE4]/5 rounded-t-lg"></div>
                <div className="relative flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00B4D8] to-[#48CAE4] rounded-full flex items-center justify-center shadow-md">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="User" className="w-full h-full rounded-full" />
                      ) : (
                        <span className="text-[#03045E] font-bold text-sm">{initials}</span>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-gray-900 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#CAF0F8] font-semibold text-sm truncate">
                      {user.full_name}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {user.email}
                    </p>
                    {user.role && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gradient-to-r from-[#00B4D8] to-[#48CAE4] text-[#03045E] text-xs rounded-full font-medium shadow-sm">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-[#CAF0F8] transition-all duration-200 group"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-[#00B4D8] to-[#48CAE4] rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                    <User className="w-3.5 h-3.5 text-[#03045E]" />
                  </div>
                  <span className="font-medium">Profile Settings</span>
                </button>
                
                <button
                  onClick={handleOrdersClick}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-[#CAF0F8] transition-all duration-200 group"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-[#00B4D8] to-[#48CAE4] rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#03045E]" />
                  </div>
                  <span className="font-medium">My Orders</span>
                </button>
                
                <button
                  onClick={handleWishlistClick}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-[#CAF0F8] transition-all duration-200 group"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-[#00B4D8] to-[#48CAE4] rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                    <Heart className="w-3.5 h-3.5 text-[#03045E]" />
                  </div>
                  <span className="font-medium">Wishlist</span>
                </button>
                
                <button
                  onClick={handleSettingsClick}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-[#CAF0F8] transition-all duration-200 group"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-[#00B4D8] to-[#48CAE4] rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                    <Settings className="w-3.5 h-3.5 text-[#03045E]" />
                  </div>
                  <span className="font-medium">Settings</span>
                </button>
              </div>

              {/* Logout Section */}
              <div className="border-t border-gray-700/30 pt-2 pb-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 rounded-md flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                    <LogOut className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;