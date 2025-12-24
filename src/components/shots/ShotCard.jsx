import React from 'react';

const ShotCard = ({ shot, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3 border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h4 className="text-md font-semibold text-gray-900">
            Shot #{shot.shot_number}
          </h4>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 text-sm">
            <div className="text-gray-700">
              <span className="font-medium">Grind Setting:</span> {shot.grind_setting}
            </div>
            <div className="text-gray-700">
              <span className="font-medium">Dose:</span> {shot.dose}g
            </div>
            <div className="text-gray-700">
              <span className="font-medium">Yield:</span> {shot.yield}g
            </div>
            <div className="text-gray-700">
              <span className="font-medium">Time:</span> {shot.time_seconds}s
            </div>
              <div className="text-gray-700">
                <span className="font-medium">Water Temp:</span> {shot.water_temperature}°C
              </div>
            {/* {shot.water_temperature && (
            )} */}
          </div>
          
          {shot.taste_notes && (
            <div className="mt-2 text-sm">
              <span className="font-medium text-gray-700">Taste Notes:</span> 
              <p className="text-gray-600">{shot.taste_notes}</p>
            </div>
          )}
          
          {shot.action_taken && (
            <div className="mt-2 text-sm">
              <span className="font-medium text-gray-700">Action Taken:</span> 
              <p className="text-gray-600">{shot.action_taken}</p>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(shot)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
            aria-label="Edit shot"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(shot.id)}
            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
            aria-label="Delete shot"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShotCard;