import React, { useState, useEffect } from 'react';
import { ShotSchema, validateShotData } from '../../types/shot';

const ShotFormModal = ({ isOpen, onClose, shot, sessionId, onSubmit, existingShots }) => {
  const [formData, setFormData] = useState({ ...ShotSchema });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && shot) {
      // Editing existing shot
      setFormData({
        ...ShotSchema,
        ...shot
      });
    } else if (isOpen) {
      // Creating new shot - find next available shot number
      const nextShotNumber = getNextAvailableShotNumber(existingShots || []);
      setFormData({ ...ShotSchema, calibration_session_id: sessionId, shot_number: nextShotNumber });
    }
    setErrors({});
  }, [isOpen, shot, sessionId, existingShots]);

  // Function to get the next available shot number
  const getNextAvailableShotNumber = (existingShots) => {
    if (!existingShots || existingShots.length === 0) {
      return 1;
    }
    
    // Get all shot numbers that already exist
    const existingNumbers = existingShots.map(s => s.shot_number);
    // Find the lowest available number starting from 1
    let number = 1;
    while (existingNumbers.includes(number)) {
      number++;
    }
    return number;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For numeric fields like dose, yield, and time_seconds, we need to convert to number
    let processedValue = value;
    if (name === 'dose' || name === 'yield' || name === 'time_seconds' || name === 'shot_number') {
      processedValue = value === '' ? null : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
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
    const validationErrors = validateShotData(formData);
    if (validationErrors.length > 0) {
      const errorObj = {};
      validationErrors.forEach(error => {
        if (error.includes('Session')) errorObj.calibration_session_id = error;
        if (error.includes('Shot number')) errorObj.shot_number = error;
        if (error.includes('Grind setting')) errorObj.grind_setting = error;
        if (error.includes('Dose')) errorObj.dose = error;
        if (error.includes('Yield')) errorObj.yield = error;
        if (error.includes('Time')) errorObj.time_seconds = error;
      });
      setErrors(errorObj);
      setLoading(false);
      return;
    }

    // Check if shot number already exists in this session (for new shots)
    if (!shot) { // Creating new shot
      if (existingShots && existingShots.length > 0) {
        const existingShot = existingShots.find(s => s.shot_number === formData.shot_number);
        if (existingShot) {
          setErrors({ shot_number: `Shot number ${formData.shot_number} already exists for this session` });
          setLoading(false);
          return;
        }
      }
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting shot:', error);
      setErrors({ submit: error.message || 'An error occurred while saving the shot.' });
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
                    {shot ? 'Edit Shot' : 'Add New Shot'}
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="shot_number" className="block text-sm font-medium text-gray-700">
                          Shot Number *
                        </label>
                        <input
                          type="number"
                          name="shot_number"
                          id="shot_number"
                          value={formData.shot_number || ''}
                          onChange={handleChange}
                          min="1"
                          disabled={!!shot} // Disable shot number field when editing existing shot
                          className={`mt-1 block w-full border ${
                            errors.shot_number ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                            shot ? 'bg-gray-100' : ''
                          }`}
                          placeholder={shot ? "Locked" : "Autogenerated"}
                        />
                        {errors.shot_number && <p className="mt-1 text-sm text-red-600">{errors.shot_number}</p>}
                        {!shot && <p className="mt-1 text-xs text-gray-500">Automatically assigned based on existing shots</p>}
                      </div>

                      <div>
                        <label htmlFor="grind_setting" className="block text-sm font-medium text-gray-700">
                          Grind Setting *
                        </label>
                        <input
                          type="text"
                          name="grind_setting"
                          id="grind_setting"
                          value={formData.grind_setting || ''}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.grind_setting ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          placeholder="e.g., 15"
                        />
                        {errors.grind_setting && <p className="mt-1 text-sm text-red-600">{errors.grind_setting}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="dose" className="block text-sm font-medium text-gray-700">
                          Dose (g) *
                        </label>
                        <input
                          type="number"
                          name="dose"
                          id="dose"
                          value={formData.dose || ''}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className={`mt-1 block w-full border ${
                            errors.dose ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          placeholder="e.g., 18.00"
                        />
                        {errors.dose && <p className="mt-1 text-sm text-red-600">{errors.dose}</p>}
                      </div>

                      <div>
                        <label htmlFor="yield" className="block text-sm font-medium text-gray-700">
                          Yield (g) *
                        </label>
                        <input
                          type="number"
                          name="yield"
                          id="yield"
                          value={formData.yield || ''}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className={`mt-1 block w-full border ${
                            errors.yield ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          placeholder="e.g., 36.00"
                        />
                        {errors.yield && <p className="mt-1 text-sm text-red-600">{errors.yield}</p>}
                      </div>

                      <div>
                        <label htmlFor="time_seconds" className="block text-sm font-medium text-gray-700">
                          Time (s) *
                        </label>
                        <input
                          type="number"
                          name="time_seconds"
                          id="time_seconds"
                          value={formData.time_seconds || ''}
                          onChange={handleChange}
                          min="1"
                          className={`mt-1 block w-full border ${
                            errors.time_seconds ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          placeholder="e.g., 32"
                        />
                        {errors.time_seconds && <p className="mt-1 text-sm text-red-600">{errors.time_seconds}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="taste_notes" className="block text-sm font-medium text-gray-700">
                        Taste Notes
                      </label>
                      <textarea
                        name="taste_notes"
                        id="taste_notes"
                        rows="2"
                        value={formData.taste_notes || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="How did the shot taste?"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="action_taken" className="block text-sm font-medium text-gray-700">
                        Action Taken
                      </label>
                      <textarea
                        name="action_taken"
                        id="action_taken"
                        rows="2"
                        value={formData.action_taken || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="What was done after this shot?"
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
                {loading ? 'Saving...' : (shot ? 'Update Shot' : 'Add Shot')}
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

export default ShotFormModal;