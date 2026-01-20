import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ title = 'Espresso Calibrator' }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  // Determine active link
  const isActive = (path) => location.pathname === path;

  return (
    <header className="flex justify-between items-center py-4 border-b border-amber-200">
      <h1 className="text-2xl font-bold text-amber-800">{title}</h1>

      {isAuthenticated && user && (
        <div className="flex items-center">
          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
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
            <span className="text-gray-700">Welcome, {user.name}!</span>
          </nav>
          <button
            onClick={handleLogout}
            className="hidden md:block px-4 py-2 bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Logout
          </button>

          {/* Mobile Menu Button - Visible only on mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-expanded={isMenuOpen}
              aria-label="Main menu"
            >
              {/* Hamburger icon */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  // Close icon (X)
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // Menu icon (three lines)
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu - Hidden on desktop */}
      {isAuthenticated && user && (
        <div className={`fixed inset-0 z-50 md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Mobile menu panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-amber-800">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-md text-gray-700 hover:text-amber-800 focus:outline-none"
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <nav className="flex flex-col p-4 space-y-4">
              <Link
                to="/"
                className={`py-2 px-4 rounded-md ${isActive('/') ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/beans"
                className={`py-2 px-4 rounded-md ${isActive('/beans') ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Beans
              </Link>
              <Link
                to="/grinders"
                className={`py-2 px-4 rounded-md ${isActive('/grinders') ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Grinders
              </Link>
              <Link
                to="/sessions"
                className={`py-2 px-4 rounded-md ${isActive('/sessions') ? 'bg-amber-100 text-amber-800 font-medium' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sessions
              </Link>

              {/* User info and logout - MOVE THIS SECTION HERE */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-gray-700 py-2 px-4">Welcome, {user.name}!</div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 py-3 px-4 bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;