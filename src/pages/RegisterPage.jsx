import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registerValidationSchema } from '../utils/validation';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(registerValidationSchema),
  });

  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
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
      const result = await registerUser(
        data.name,
        data.email,
        data.password,
        data.passwordConfirmation
      );

      if (result.success) {
        setSuccess(true);
        setCountdown(5);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-[#DCD6F7] relative p-16">
        <div className="absolute top-10 left-12 text-3xl font-bold text-indigo-600">
          kalyb
        </div>

        <div className="mt-auto mb-20">
          <h1 className="text-3xl font-semibold text-gray-800">
            Join Us!
          </h1>
          <p className="mt-2 text-xl text-gray-600">
            Start building something <br />
            amazing today.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-10 text-indigo-600 hover:underline text-sm"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md">

          <h2 className="text-center text-2xl font-semibold mb-8">
            Create Account
          </h2>

          {!success ? (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* NAME */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 ${errors.name
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-indigo-300'
                      }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="example@email.com"
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
                    placeholder="Create a password"
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

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...register('passwordConfirmation')}
                    placeholder="Confirm your password"
                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 ${errors.passwordConfirmation
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-indigo-300'
                      }`}
                  />
                  {errors.passwordConfirmation && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.passwordConfirmation.message}
                    </p>
                  )}
                </div>

                {/* REGISTER BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-medium transition ${loading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90'
                    }`}
                >
                  {loading ? 'Creating Account...' : 'Register →'}
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="text-center animate-fade-in">

              {/* ICON */}
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* TITLE */}
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Account Created Successfully
              </h3>

              {/* DESCRIPTION */}
              <p className="text-gray-600 mb-8 leading-relaxed">
                Your account has been created successfully.
                <br />
                Redirecting to login in{" "}
                <span className="font-semibold text-indigo-600">
                  {countdown}s
                </span>
              </p>

              {/* BUTTON */}
              <button
                onClick={() => navigate('/login?registered=true')}
                className="w-full py-3 rounded-xl text-white font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition"
              >
                Go to Login →
              </button>

            </div>
          )}

          {/* FOOTER */}
          <div className="text-center text-xs text-gray-400 mt-16">
            Terms & Condition • Privacy Policy
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;