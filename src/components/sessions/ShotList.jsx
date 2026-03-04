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
    if (!window.confirm('Delete this shot?')) return;

    try {
      await shotAPI.deleteShot(sessionId, shotId);
      setShots(prev => prev.filter(shot => shot.id !== shotId));
    } catch (err) {
      setError(err.message || 'Failed to delete shot');
    }
  };

  const handleFormSubmit = async (shotData) => {
    try {
      if (!editingShot) {
        const exists = shots.find(s => s.shot_number === shotData.shot_number);
        if (exists) {
          throw new Error(`Shot #${shotData.shot_number} already exists`);
        }
      }

      if (editingShot) {
        const response = await shotAPI.updateShot(sessionId, editingShot.id, shotData);
        const updatedShot = response.data.data || response.data;

        setShots(prev =>
          prev.map(shot =>
            shot.id === editingShot.id ? { ...updatedShot, id: editingShot.id } : shot
          )
        );
      } else {
        const response = await shotAPI.createShot(sessionId, shotData);
        const newShot = response.data.data || response.data;

        setShots(prev => [...prev, newShot]);
      }
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
        err.message ||
        'Failed to save shot'
      );
    }
  };

  const sortedShots = [...shots].sort(
    (a, b) => a.shot_number - b.shot_number
  );

  return (
    <div className="mt-8">

      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Extraction Shots
          </h3>
          <p className="text-sm text-gray-500">
            Record and analyze shot performance
          </p>
        </div>

        <button
          onClick={handleAddShot}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-black text-white hover:bg-gray-800 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Shot
        </button>
      </div>

      {/* ===== Error State ===== */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ===== Loading State ===== */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : sortedShots.length === 0 ? (

        /* ===== Empty State ===== */
        <div className="border border-dashed border-gray-300 rounded-xl py-12 text-center bg-gray-50">
          <div className="text-gray-400 mb-3">
            <svg className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h4 className="text-sm font-semibold text-gray-800">
            No shots recorded
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            Start logging extraction data for this session.
          </p>

          <button
            onClick={handleAddShot}
            className="mt-4 inline-flex items-center px-4 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-800"
          >
            Add First Shot
          </button>
        </div>

      ) : (

        /* ===== Shot Cards ===== */
        <div className="space-y-4">
          {sortedShots.map(shot => (
            <ShotCard
              key={shot.id}
              shot={shot}
              onEdit={handleEditShot}
              onDelete={handleDeleteShot}
            />
          ))}
        </div>
      )}

      {/* ===== Shot Modal ===== */}
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