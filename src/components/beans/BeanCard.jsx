import React from 'react';
import { BEAN_ROAST_LEVELS } from '../../types/bean';

const BeanCard = ({ bean, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getRoastLevelDisplay = (roastLevel) => {
    const roastLabels = {
      [BEAN_ROAST_LEVELS.LIGHT]: 'Light',
      [BEAN_ROAST_LEVELS.MEDIUM]: 'Medium',
      [BEAN_ROAST_LEVELS.DARK]: 'Dark',
    };
    return roastLabels[roastLevel] || roastLevel;
  };

  const getRoastBadgeStyle = (roastLevel) => {
    switch (roastLevel) {
      case BEAN_ROAST_LEVELS.LIGHT:
        return 'bg-yellow-100 text-yellow-800';
      case BEAN_ROAST_LEVELS.MEDIUM:
        return 'bg-orange-100 text-orange-800';
      case BEAN_ROAST_LEVELS.DARK:
        return 'bg-amber-200 text-amber-900';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="group bg-white/80 backdrop-blur rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-gray-900 truncate">
            {bean.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {bean.roastery || 'Independent / Not specified'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-70 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(bean)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Edit bean"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(bean.id)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Delete bean"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700">

        <div>
          <span className="text-gray-400">Origin</span>
          <div className="font-medium">
            {bean.origin || 'Not specified'}
          </div>
        </div>

        <div>
          <span className="text-gray-400">Type</span>
          <div className="font-medium">
            {bean.is_blend ? 'Blend' : 'Single Origin'}
          </div>
        </div>

        <div>
          <span className="text-gray-400">Roast Level</span>
          <div className="mt-1">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoastBadgeStyle(bean.roast_level)}`}>
              {getRoastLevelDisplay(bean.roast_level)}
            </span>
          </div>
        </div>

        {bean.roast_date && (
          <div>
            <span className="text-gray-400">Roasted</span>
            <div className="font-medium">
              {formatDate(bean.roast_date)}
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      {bean.notes && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
            Notes
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {bean.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default BeanCard;