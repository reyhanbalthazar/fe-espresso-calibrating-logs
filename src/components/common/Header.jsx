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

  const isActive = (path) => location.pathname === path;

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition
        ${isActive(path)
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
        }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
              EC
            </div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h1>
          </div>

          {isAuthenticated && user && (
            <div className="flex items-center gap-6">

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-2">
                {navLink('/', 'Home')}
                {navLink('/beans', 'Beans')}
                {navLink('/grinders', 'Grinders')}
                {navLink('/sessions', 'Sessions')}
              </nav>

              {/* User Section */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-sm font-medium 
                  text-white bg-gradient-to-r from-indigo-500 to-purple-600 
                  hover:opacity-90 transition shadow-sm"
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <svg
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      {isAuthenticated && user && (
        <div
          className={`fixed inset-0 z-50 md:hidden transition ${isMenuOpen ? 'visible' : 'invisible'
            }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Panel */}
          <div
            className={`absolute top-0 right-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Logged in
                  </div>
                </div>
              </div>
            </div>

            <nav className="p-6 flex flex-col gap-3">
              {navLink('/', 'Home')}
              {navLink('/beans', 'Beans')}
              {navLink('/grinders', 'Grinders')}
              {navLink('/sessions', 'Sessions')}

              <div className="pt-6 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl text-white font-medium
                  bg-gradient-to-r from-indigo-500 to-purple-600 
                  hover:opacity-90 transition"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;