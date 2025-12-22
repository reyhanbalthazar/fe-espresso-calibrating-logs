import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/common/Header';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';

// Placeholder for the main dashboard/home page
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="max-w-4xl mx-auto p-4">
        <Header title="Espresso Calibrator" />

        <main className="mt-8 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Dashboard</h2>
            <p className="text-gray-600 text-center">Welcome to your espresso calibration dashboard!</p>
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
