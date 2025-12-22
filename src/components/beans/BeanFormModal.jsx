import React, { useState, useEffect } from 'react';
import { BeanSchema, BEAN_ROAST_LEVELS, validateBeanData } from '../../types/bean';

const BeanFormModal = ({ isOpen, onClose, bean, onSubmit }) => {
  const [formData, setFormData] = useState({ ...BeanSchema });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && bean) {
      // Editing existing bean
      setFormData({
        ...BeanSchema,
        ...bean
      });
    } else if (isOpen) {
      // Creating new bean
      setFormData({ ...BeanSchema });
    }
    setErrors({});
  }, [isOpen, bean]);

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
    const validationErrors = validateBeanData(formData);
    if (validationErrors.length > 0) {
      const errorObj = {};
      validationErrors.forEach(error => {
        // Map generic error messages to field-specific ones
        if (error.includes('Name')) errorObj.name = error;
        if (error.includes('Origin')) errorObj.origin = error;
        if (error.includes('Roastery')) errorObj.roastery = error;
        if (error.includes('roast level')) errorObj.roast_level = error;
        if (error.includes('roast date')) errorObj.roast_date = error;
      });
      setErrors(errorObj);
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        ...formData,
        roast_date: formData.roast_date ? formData.roast_date : null
      });
      onClose();
    } catch (error) {
      console.error('Error submitting bean:', error);
      setErrors({ submit: error.message || 'An error occurred while saving the bean.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const roastLevels = Object.entries(BEAN_ROAST_LEVELS).map(([key, value]) => ({
    value: value,
    label: key.charAt(0).toUpperCase() + key.slice(1)
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {bean ? 'Edit Bean' : 'Add New Bean'}
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="Enter bean name"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="roastery" className="block text-sm font-medium text-gray-700">
                        Roastery
                      </label>
                      <input
                        type="text"
                        name="roastery"
                        id="roastery"
                        value={formData.roastery || ''}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                          errors.roastery ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="Enter roastery name"
                      />
                      {errors.roastery && <p className="mt-1 text-sm text-red-600">{errors.roastery}</p>}
                    </div>

                    <div>
                      <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
                        Origin
                      </label>
                      <input
                        type="text"
                        name="origin"
                        id="origin"
                        value={formData.origin || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter origin location"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="roast_level" className="block text-sm font-medium text-gray-700">
                          Roast Level
                        </label>
                        <select
                          name="roast_level"
                          id="roast_level"
                          value={formData.roast_level || BEAN_ROAST_LEVELS.MEDIUM}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.roast_level ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        >
                          {roastLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                        {errors.roast_level && <p className="mt-1 text-sm text-red-600">{errors.roast_level}</p>}
                      </div>

                      <div>
                        <label htmlFor="roast_date" className="block text-sm font-medium text-gray-700">
                          Roast Date
                        </label>
                        <input
                          type="date"
                          name="roast_date"
                          id="roast_date"
                          value={formData.roast_date || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        id="notes"
                        rows="3"
                        value={formData.notes || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Additional notes about the beans..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              {errors.submit && (
                <div className="mb-2 sm:mb-0 sm:mr-2 text-sm text-red-600">{errors.submit}</div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Saving...' : (bean ? 'Update Bean' : 'Add Bean')}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BeanFormModal;