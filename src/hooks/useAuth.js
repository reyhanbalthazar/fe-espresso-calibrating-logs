import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Custom hook for authentication
export const useAuthHook = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authenticated on hook initialization
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          setLoading(true);
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (err) {
          // Token is invalid or expired
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login({ email, password });
      
      // Store token and user in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      setToken(response.data.token);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, passwordConfirmation) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register({ 
        name, 
        email, 
        password, 
        password_confirmation: passwordConfirmation 
      });
      
      // Store token and user in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      setToken(response.data.token);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      const errorDetails = err.response?.data?.errors || null;
      setError(errorMessage);
      return { success: false, error: errorMessage, details: errorDetails };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
      // Continue with local logout even if API request fails
    }
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout
  };
};