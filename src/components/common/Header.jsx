import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ title = 'Espresso Calibrator' }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  // Determine active link
  const isActive = (path) => location.pathname === path;

  return (
    <header className="flex justify-between items-center py-4 border-b border-amber-200">
      <h1 className="text-2xl font-bold text-amber-800">{title}</h1>

      {isAuthenticated && user && (
        <div className="flex items-center space-x-6">
          <nav className="flex space-x-4">
            <Link
              to="/"
              className={`${isActive('/') ? 'text-amber-800 font-medium' : 'text-gray-600 hover:text-amber-800'} transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/beans"
              className={`${isActive('/beans') ? 'text-amber-800 font-medium' : 'text-gray-600 hover:text-amber-800'} transition-colors`}
            >
              Beans
            </Link>
            <Link
              to="/grinders"
              className={`${isActive('/grinders') ? 'text-amber-800 font-medium' : 'text-gray-600 hover:text-amber-800'} transition-colors`}
            >
              Grinders
            </Link>
            <Link
              to="/sessions"
              className={`${isActive('/sessions') ? 'text-amber-800 font-medium' : 'text-gray-600 hover:text-amber-800'} transition-colors`}
            >
              Sessions
            </Link>
          </nav>
          <span className="text-gray-700">Welcome, {user.name}!</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;