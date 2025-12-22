import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registerValidationSchema } from '../utils/validation';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5); // 5 second countdown
  const navigate = useNavigate();
  const { register: registerUser } = useAuth(); // Use the register function from AuthContext

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(registerValidationSchema)
  });

  // Countdown effect when registration is successful
  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      navigate('/login?registered=true');
    }

    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Use the register function from AuthContext
      const result = await registerUser(
        data.name,
        data.email,
        data.password,
        data.passwordConfirmation
      );

      if (result.success) {
        // Show success message and start countdown
        setSuccess(true);
        setCountdown(5);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-800">Espresso Calibrator</h1>
          <h2 className="text-xl mt-2 text-gray-700">Create Account</h2>
        </div>

        {!success ? (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                    errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200 focus:border-amber-500'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

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
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="passwordConfirmation"
                  type="password"
                  {...register('passwordConfirmation', {
                    required: 'Please confirm your password',
                    validate: (value) => value === watch('password') || 'Passwords do not match'
                  })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                    errors.passwordConfirmation ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-amber-200 focus:border-amber-500'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.passwordConfirmation && (
                  <p className="mt-1 text-sm text-red-600">{errors.passwordConfirmation.message}</p>
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
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-amber-600 hover:text-amber-800 font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </>
        ) : (
          // Success message with countdown
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">Registration Successful!</h3>
            <p className="text-gray-600 mb-4">
              Your account has been created successfully. You will be redirected to the login page in {countdown} seconds.
            </p>

            <button
              onClick={() => navigate('/login?registered=true')}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Go to Login Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;