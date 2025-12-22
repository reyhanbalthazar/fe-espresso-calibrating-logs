import React, { useState, useEffect } from 'react';
import ShotCard from '../shots/ShotCard';
import ShotFormModal from '../shots/ShotFormModal';
import { shotAPI } from '../../services/api';

const ShotList = ({ sessionId, sessionDate }) => {
  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingShot, setEditingShot] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetchShots();
    }
  }, [sessionId]);

  const fetchShots = async () => {
    try {
      setLoading(true);
      const response = await shotAPI.getAllShots(sessionId);
      setShots(response.data.data || response.data);
    } catch (err) {
      setError(err.message || 'Failed to load shots');
      console.error('Error fetching shots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddShot = () => {
    setEditingShot(null);
    setShowFormModal(true);
  };

  const handleEditShot = (shot) => {
    setEditingShot(shot);
    setShowFormModal(true);
  };

  const handleDeleteShot = async (shotId) => {
    if (!window.confirm('Are you sure you want to delete this shot?')) {
      return;
    }

    try {
      await shotAPI.deleteShot(sessionId, shotId);
      setShots(shots.filter(shot => shot.id !== shotId));
    } catch (err) {
      setError(err.message || 'Failed to delete shot');
      console.error('Error deleting shot:', err);
    }
  };

  const handleFormSubmit = async (shotData) => {
    try {
      if (editingShot) {
        // Update existing shot
        const response = await shotAPI.updateShot(sessionId, editingShot.id, shotData);
        const updatedShot = response.data.data || response.data;
        setShots(shots.map(shot => 
          shot.id === editingShot.id ? { ...updatedShot, id: editingShot.id } : shot
        ));
      } else {
        // Create new shot
        const response = await shotAPI.createShot(sessionId, shotData);
        const newShot = response.data.data || response.data;
        setShots([...shots, newShot]);
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to save shot');
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Shots</h3>
        <button
          onClick={handleAddShot}
          className="ml-3 inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Shot
        </button>
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
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : shots.length === 0 ? (
        <div className="text-center py-6">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No shots</h3>
          <p className="mt-1 text-sm text-gray-500">
            No shots recorded for this session yet.
          </p>
          <div className="mt-4">
            <button
              onClick={handleAddShot}
              className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Shot
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {[...shots].sort((a, b) => a.shot_number - b.shot_number).map(shot => (
            <ShotCard
              key={shot.id}
              shot={shot}
              onEdit={handleEditShot}
              onDelete={handleDeleteShot}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <ShotFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        shot={editingShot}
        sessionId={sessionId}
        onSubmit={handleFormSubmit}
        existingShots={shots}
      />
    </div>
  );
};

export default ShotList;