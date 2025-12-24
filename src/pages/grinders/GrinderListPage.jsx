import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { grinderAPI } from '../../services/api';
import GrinderCard from '../../components/grinders/GrinderCard';
import GrinderFormModal from '../../components/grinders/GrinderFormModal';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/common/Header';

const GrinderListPage = () => {
  const [grinders, setGrinders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingGrinder, setEditingGrinder] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, checkingAuthStatus } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!checkingAuthStatus && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, checkingAuthStatus, navigate]);

  useEffect(() => {
    if (!isAuthenticated || checkingAuthStatus) return;

    const fetchGrinders = async () => {
      try {
        setLoading(true);
        const response = await grinderAPI.getAllGrinders();
        setGrinders(response.data.data || response.data); // Handle different response structures
      } catch (err) {
        setError(err.message || 'Failed to load grinders');
        console.error('Error fetching grinders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrinders();
  }, [isAuthenticated, checkingAuthStatus]);

  const handleAddGrinder = () => {
    setEditingGrinder(null);
    setShowFormModal(true);
  };

  const handleEditGrinder = (grinder) => {
    setEditingGrinder(grinder);
    setShowFormModal(true);
  };

  const handleDeleteGrinder = async (grinderId) => {
    if (!window.confirm('Are you sure you want to delete this grinder?')) {
      return;
    }

    try {
      await grinderAPI.deleteGrinder(grinderId);
      setGrinders(grinders.filter(grinder => grinder.id !== grinderId));
    } catch (err) {
      setError(err.message || 'Failed to delete grinder');
      console.error('Error deleting grinder:', err);
    }
  };

  const handleFormSubmit = async (grinderData) => {
    try {
      if (editingGrinder) {
        // Update existing grinder
        const response = await grinderAPI.updateGrinder(editingGrinder.id, grinderData);
        const updatedGrinder = response.data.data || response.data;
        setGrinders(grinders.map(grinder =>
          grinder.id === editingGrinder.id ? { ...updatedGrinder, id: editingGrinder.id } : grinder
        ));
      } else {
        // Create new grinder
        const response = await grinderAPI.createGrinder(grinderData);
        const newGrinder = response.data.data || response.data;
        setGrinders([...grinders, newGrinder]);
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to save grinder');
    }
  };

  // Filter grinders based on search term
  const filteredGrinders = grinders.filter(grinder => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      grinder.name.toLowerCase().includes(searchTermLower) ||
      (grinder.model && grinder.model.toLowerCase().includes(searchTermLower)) ||
      (grinder.notes && grinder.notes.toLowerCase().includes(searchTermLower))
    );
  });

  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <Header title="Espresso Calibrator" />

        <div className="py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl truncate">
                  Grinder Management
                </h1>
                <p className="mt-1 text-sm text-gray-500 hidden sm:block">
                  Manage your coffee grinder inventory and specifications
                </p>
                <p className="mt-1 text-sm text-gray-500 sm:hidden">
                  Manage grinders
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddGrinder}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 sm:hidden" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Add Grinder</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="mb-6">
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2 border-gray-300 rounded-md"
                    placeholder="Search grinders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="mb-6 bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h2c2.21 0 4-1.79 4-4V7M4 7c0-2.21 1.79-4 4-4h2c2.21 0 4 1.79 4 4m0 10c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4" />
                      </svg>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Grinders</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{filteredGrinders.length}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grinder list */}
              {filteredGrinders.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h2c2.21 0 4-1.79 4-4V7M4 7c0-2.21 1.79-4 4-4h2c2.21 0 4 1.79 4 4m0 10c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No grinders</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new grinder.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handleAddGrinder}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Grinder
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredGrinders.map(grinder => (
                    <GrinderCard
                      key={grinder.id}
                      grinder={grinder}
                      onEdit={handleEditGrinder}
                      onDelete={handleDeleteGrinder}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Form Modal */}
          <GrinderFormModal
            isOpen={showFormModal}
            onClose={() => setShowFormModal(false)}
            grinder={editingGrinder}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>

  );
};

export default GrinderListPage;