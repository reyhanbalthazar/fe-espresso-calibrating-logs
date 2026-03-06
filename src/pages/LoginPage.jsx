import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginValidationSchema } from '../utils/validation';
import { authAPI } from '../services/api';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      setLoginSuccessMessage(
        'Registration successful! Please log in with your credentials.'
      );
    }
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setResendMessage('');
    setResendError('');

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const showResendLink = error.toLowerCase().includes('verify your email');

  const handleResendVerification = async () => {
    const email = getValues('email')?.trim();
    if (!email) {
      setResendError('Please fill your email first.');
      return;
    }

    setResendLoading(true);
    setResendMessage('');
    setResendError('');
    try {
      const response = await authAPI.resendVerificationEmail(email);
      const message =
        response?.data?.message || 'Verification email has been sent. Please check your inbox.';
      setResendMessage(message);
    } catch (err) {
      setResendError(
        err?.response?.data?.message || 'Failed to resend verification email.'
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="login-page-bg min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 relative p-16">
        <div className="absolute top-10 left-12 text-3xl font-bold text-indigo-600">
          KALYBRATE
        </div>

        <div className="mt-auto mb-20">
          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome!
          </h1>
          <p className="mt-2 text-xl text-gray-600">
            <span className="font-semibold text-gray-800">
              Build, Create,
            </span>{' '}
            and <br />
            Innovate with KALYBRATE
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6 py-10 md:px-10">
        <div className="w-full max-w-md rounded-2xl border border-white/50 bg-white/85 p-6 shadow-xl backdrop-blur-sm md:p-8">

          <h2 className="text-center text-2xl font-semibold mb-8">
            Login
          </h2>

          {loginSuccessMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {loginSuccessMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
              {showResendLink && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="font-semibold underline hover:no-underline disabled:opacity-60"
                  >
                    {resendLoading ? 'Sending...' : 'Resend Email Verification'}
                  </button>
                </div>
              )}
            </div>
          )}
          {resendMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {resendMessage}
            </div>
          )}
          {resendError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {resendError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="example123"
                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 ${errors.email
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-indigo-300'
                  }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 ${errors.password
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-indigo-300'
                  }`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between text-sm">

              <Link
                to="/forgot-password"
                className="text-indigo-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-medium transition ${loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90'
                }`}
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>

            {/* CREATE ACCOUNT */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don’t have account?{' '}
              <Link
                to="/register"
                className="text-indigo-600 font-medium hover:underline"
              >
                Create Account
              </Link>
            </p>
          </form>

          {/* FOOTER */}
          <div className="text-center text-xs text-gray-400 mt-16">
            Terms & Condition • Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
