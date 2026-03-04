import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkingAuthStatus, user } = useAuth();

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

  // Extra guard: authenticated but email not verified should never access app pages
  if (!user?.email_verified_at) {
    return <Navigate to="/login?unverified=true" replace />;
  }

  // Return the protected content
  return children;
};

export default ProtectedRoute;
