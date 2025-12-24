import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import BeanListPage from './pages/beans/BeanListPage';
import GrinderListPage from './pages/grinders/GrinderListPage';
import SessionListPage from './pages/sessions/SessionListPage';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/beans" element={
            <ProtectedRoute>
              <BeanListPage />
            </ProtectedRoute>
          } />
          <Route path="/grinders" element={
            <ProtectedRoute>
              <GrinderListPage />
            </ProtectedRoute>
          } />
          <Route path="/sessions" element={
            <ProtectedRoute>
              <SessionListPage />
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
