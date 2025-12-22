import React, { useState } from 'react';
import ShotList from './ShotList';

const SessionCard = ({ session, beans, grinders, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Find related bean and grinder data
  const bean = beans.find(b => b.id === session.bean_id);
  const grinder = grinders.find(g => g.id === session.grinder_id);

  // State to track if shots section is expanded
  const [showShots, setShowShots] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">
            {bean ? bean.name : 'Unknown Bean'}
            {grinder ? ` - ${grinder.name}` : ' - Unknown Grinder'}
          </h3>
          <p className="text-sm text-gray-600">
            Session on {formatDate(session.session_date)}
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => setShowShots(!showShots)}
            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50"
            aria-label={showShots ? "Collapse shots" : "Expand shots"}
          >
            {showShots ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onEdit(session)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
            aria-label="Edit session"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(session.id)}
            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
            aria-label="Delete session"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <div className="text-sm text-gray-700">
          <span className="font-medium">Bean:</span> {bean ? `${bean.name} (${bean.origin || 'Origin not specified'})` : 'Unknown Bean'}
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-medium">Grinder:</span> {grinder ? grinder.name : 'Unknown Grinder'}
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-medium">Session Date:</span> {formatDate(session.session_date)}
        </div>
      </div>

      {session.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {session.notes}
          </div>
        </div>
      )}

      {/* Shots section - only shown when expanded */}
      {showShots && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <ShotList sessionId={session.id} sessionDate={session.session_date} />
        </div>
      )}
    </div>
  );
};

export default SessionCard;