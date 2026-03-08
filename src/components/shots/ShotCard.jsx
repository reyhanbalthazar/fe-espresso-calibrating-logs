import React from 'react';

const ShotCard = ({ shot, onEdit, onDelete }) => {
  const ratio =
    shot.dose && shot.yield
      ? (shot.yield / shot.dose).toFixed(2)
      : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-5">

      {/* ===== Header ===== */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            Shot #{shot.shot_number}
          </h4>
          {ratio && (
            <p className="text-sm text-gray-500 mt-1">
              Brew Ratio 1:{ratio}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(shot)}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
            aria-label="Edit shot"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(shot.shot_number)}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
            aria-label="Delete shot"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* ===== Core Metrics (Primary Section) ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <Metric label="Dose" value={`${shot.dose || '-'} g`} />
        <Metric label="Yield" value={`${shot.yield || '-'} g`} />
        <Metric label="Time" value={`${shot.time_seconds || '-'} s`} />
        <Metric label="Grind" value={shot.grind_setting || '-'} />
      </div>

      {/* ===== Secondary Metrics ===== */}
      {shot.water_temperature && (
        <div className="text-sm text-gray-600 mb-3">
          <span className="text-gray-500">Water Temp:</span>{' '}
          <span className="font-medium text-gray-800">
            {shot.water_temperature}°C
          </span>
        </div>
      )}

      {/* ===== Notes Section ===== */}
      {(shot.taste_notes || shot.action_taken) && (
        <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
          {shot.taste_notes && (
            <div>
              <span className="block text-gray-500 mb-1">Taste Notes</span>
              <p className="text-gray-700">{shot.taste_notes}</p>
            </div>
          )}

          {shot.action_taken && (
            <div>
              <span className="block text-gray-500 mb-1">Adjustment</span>
              <p className="text-gray-700">{shot.action_taken}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Metric = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg px-3 py-2">
    <span className="block text-xs uppercase tracking-wide text-gray-500">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-900">
      {value}
    </span>
  </div>
);

export default ShotCard;
