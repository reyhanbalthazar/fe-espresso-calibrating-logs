import React, { useState } from 'react';
import ShotList from './ShotList';

const SessionCard = ({ session, beans, grinders, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const bean = beans.find(b => b.id === session.bean_id);
  const grinder = grinders.find(g => g.id === session.grinder_id);

  const [showShots, setShowShots] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">

      {/* ===== Header ===== */}
      <div className="p-5 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {bean?.name || 'Unknown Bean'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {grinder?.name || 'Unknown Grinder'} • {formatDate(session.session_date)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">

          {/* Expand Shots */}
          <button
            onClick={() => setShowShots(!showShots)}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
            aria-label="Toggle shots"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-200 ${showShots ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={() => onEdit(session)}
            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(session.id)}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* ===== Metadata Section ===== */}
      <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
        <div>
          <span className="text-gray-500">Bean Origin</span>
          <p className="font-medium text-gray-800">
            {bean?.origin || 'Not specified'}
          </p>
        </div>

        <div>
          <span className="text-gray-500">Grinder</span>
          <p className="font-medium text-gray-800">
            {grinder?.name || 'Unknown'}
          </p>
        </div>

        <div>
          <span className="text-gray-500">Session Date</span>
          <p className="font-medium text-gray-800">
            {formatDate(session.session_date)}
          </p>
        </div>
      </div>

      {/* ===== Notes ===== */}
      {session.notes && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-700">
          <span className="block text-gray-500 mb-1">Notes</span>
          {session.notes}
        </div>
      )}

      {/* ===== Shots Section ===== */}
      {showShots && (
        <div className="px-5 py-4 border-t border-gray-200 bg-white">
          <ShotList
            sessionId={session.id}
            sessionDate={session.session_date}
          />
        </div>
      )}
    </div>
  );
};

export default SessionCard;