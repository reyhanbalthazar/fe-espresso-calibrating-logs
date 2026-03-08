import React, { useState, useEffect } from 'react';
import { GrinderSchema, validateGrinderData } from '../../types/grinder';

const GrinderFormModal = ({ isOpen, onClose, grinder, onSubmit }) => {
  const [formData, setFormData] = useState({ ...GrinderSchema });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && grinder) {
      // Editing existing grinder
      setFormData({
        ...GrinderSchema,
        ...grinder
      });
    } else if (isOpen) {
      // Creating new grinder
      setFormData({ ...GrinderSchema });
    }
    setErrors({});
  }, [isOpen, grinder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form data
    const validationErrors = validateGrinderData(formData);
    if (validationErrors.length > 0) {
      const errorObj = {};
      validationErrors.forEach(error => {
        // Map generic error messages to field-specific ones
        if (error.includes('Name')) errorObj.name = error;
        if (error.includes('Model')) errorObj.model = error;
      });
      setErrors(errorObj);
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting grinder:', error);
      setErrors({ submit: error.message || 'An error occurred while saving the grinder.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 backdrop-blur-sm overflow-y-auto"
      style={{ backgroundColor: 'rgba(75, 85, 99, 0.65)' }}
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        <form onSubmit={handleSubmit}>

          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {grinder ? 'Edit Grinder' : 'Add New Grinder'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Configure your espresso grinder details
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-700 transition"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grinder Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-xl border px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Main Bar Grinder"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model || ''}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-xl border px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errors.model ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Mazzer Super Jolly, EK43, DF64..."
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-600">{errors.model}</p>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Notes
              </h3>
              <textarea
                name="notes"
                rows="4"
                value={formData.notes || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Burr type, grind retention, calibration notes, maintenance history..."
              />
            </div>

          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-gray-50 border-t flex justify-end space-x-3">
            {errors.submit && (
              <p className="text-sm text-red-600 self-center">{errors.submit}</p>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : grinder ? 'Update Grinder' : 'Add Grinder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrinderFormModal;
