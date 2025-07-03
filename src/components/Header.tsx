import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockUser = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  image: '', // put image url here if available
};

const Header: React.FC = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const initials = mockUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="pharma-header">
      <div className="pharma-header-left">
        <div className="pharma-logo-center">
          <img src="/drone.png" alt="Logo" className="pharma-logo-center-img" />
          <span className="pharma-logo-center-text">PharmaFly</span>
        </div>
      </div>
      <div className="pharma-header-right">
        <div
          className="pharma-avatar-placeholder clickable"
          onClick={() => {
            if (!signedIn) navigate('/login');
            else setShowDropdown((v) => !v);
          }}
          tabIndex={0}
          role="button"
          aria-label={signedIn ? 'User menu' : 'Sign in'}
        >
          {signedIn && mockUser.image ? (
            <img src={mockUser.image} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          ) : signedIn ? (
            initials
          ) : (
            'A'
          )}
        </div>
        {showDropdown && signedIn && (
          <div className="pharma-user-dropdown">
            <div className="pharma-user-initials">
              {mockUser.image ? (
                <img src={mockUser.image} alt="User" style={{ width: 32, height: 32, borderRadius: '50%' }} />
              ) : (
                initials
              )}
            </div>
            <div className="pharma-user-email">{mockUser.email}</div>
            <button className="pharma-logout-btn" onClick={() => { setSignedIn(false); setShowDropdown(false); }}>
              Logout
            </button>
          </div>
        )}
        <button className="pharma-logout-btn" title="Logout">
          <img src="/icons/logout.svg" alt="Logout" className="pharma-logout-icon invert" />
        </button>
      </div>
    </header>
  );
};

export default Header;