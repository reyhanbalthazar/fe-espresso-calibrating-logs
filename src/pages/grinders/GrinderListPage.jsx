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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">

        <Header title="Espresso Calibrator" />

        {/* PAGE HEADER */}
        <div className="mt-8 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Grinder Management
            </h1>
            <p className="mt-2 text-gray-500">
              Manage your coffee grinder inventory and specifications
            </p>
          </div>

          <button
            onClick={handleAddGrinder}
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl 
          text-white font-medium 
          bg-gradient-to-r from-indigo-500 to-purple-600 
          hover:opacity-90 transition shadow-md"
          >
            + Add Grinder
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search grinders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 
            bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 
            focus:border-indigo-500 outline-none transition"
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* STATS CARD */}
            <div className="mb-10">
              <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Grinders</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-1">
                    {filteredGrinders.length}
                  </p>
                </div>
              </div>
            </div>

            {/* EMPTY STATE */}
            {filteredGrinders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  No grinders yet
                </h3>
                <p className="text-gray-500 mt-2">
                  Start building your grinder inventory.
                </p>

                <button
                  onClick={handleAddGrinder}
                  className="mt-6 px-6 py-3 rounded-xl text-white font-medium
                bg-gradient-to-r from-indigo-500 to-purple-600 
                hover:opacity-90 transition shadow-md"
                >
                  Add Your First Grinder
                </button>
              </div>
            ) : (
              /* GRID */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* MODAL */}
        <GrinderFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          grinder={editingGrinder}
          onSubmit={handleFormSubmit}
        />

      </div>
    </div>
  );
};

export default GrinderListPage;