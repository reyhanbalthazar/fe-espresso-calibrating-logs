import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginValidationSchema } from '../utils/validation';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from AuthContext

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginValidationSchema)
  });

  // Handle cases where user might arrive after registration
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      setLoginSuccessMessage('Registration successful! Please log in with your credentials.');
    }
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      // Use the login function from AuthContext
      const result = await login(data.email, data.password);

      if (result.success) {
        // Redirect to dashboard or home page after successful login
        navigate('/');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-800">Espresso Calibrator</h1>
          <h2 className="text-xl mt-2 text-gray-700">Sign In</h2>
        </div>

        {loginSuccessMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {loginSuccessMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200 focus:border-amber-500'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200 focus:border-amber-500'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              loading
                ? 'bg-amber-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
            } transition-colors duration-200`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-amber-600 hover:text-amber-800 font-medium">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;