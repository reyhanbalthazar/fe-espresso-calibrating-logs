import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { authAPI } from '../services/api';

// Create Auth Context
const AuthContext = createContext();

// Reducer for auth state management
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload.user,
        token: action.payload.token,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        user: null,
        token: null,
        error: action.payload 
      };
    case 'REGISTER_START':
      return { ...state, loading: true, error: null };
    case 'REGISTER_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload.user,
        token: action.payload.token,
        error: null 
      };
    case 'REGISTER_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        user: null,
        token: null,
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        token: null,
        loading: false,
        error: null 
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    case 'CHECK_AUTH_STATUS_START':
      return { ...state, checkingAuthStatus: true };
    case 'CHECK_AUTH_STATUS_COMPLETE':
      return { ...state, checkingAuthStatus: false };
    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('authToken'),
    isAuthenticated: false,
    loading: false,
    error: null,
    checkingAuthStatus: true
  });

  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          dispatch({ type: 'CHECK_AUTH_STATUS_START' });
          
          // Verify token by fetching current user
          const response = await authAPI.getCurrentUser();
          
          dispatch({
            type: 'SET_USER',
            payload: response.data
          });
        } catch (error) {
          // Token is invalid or expired, remove it
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      dispatch({ type: 'CHECK_AUTH_STATUS_COMPLETE' });
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authAPI.login({ email, password });
      
      // Store token and user in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token
        }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (name, email, password, passwordConfirmation) => {
    dispatch({ type: 'REGISTER_START' });
    
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
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token
        }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      const errorDetails = error.response?.data?.errors || null;
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage, details: errorDetails };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Even if logout fails on the server, we should still clear local data
      console.error('Logout error:', error);
    }
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    dispatch({ type: 'LOGOUT' });
  };

  // Value to provide to consumers
  const value = {
    ...state,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};