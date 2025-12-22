import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkingAuthStatus } = useAuth();

  // Show loading while checking auth status
  if (checkingAuthStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-amber-700">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Return the protected content
  return children;
};

export default ProtectedRoute;