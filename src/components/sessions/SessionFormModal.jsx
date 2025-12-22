import React, { useState, useEffect } from 'react';
import { SessionSchema, validateSessionData } from '../../types/session';
import { beanAPI } from '../../services/api';
import { grinderAPI } from '../../services/api';

const SessionFormModal = ({ isOpen, onClose, session, onSubmit }) => {
  const [formData, setFormData] = useState({ ...SessionSchema });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [beans, setBeans] = useState([]);
  const [grinders, setGrinders] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch beans and grinders when modal opens
      fetchData();
      
      if (session) {
        // Editing existing session
        setFormData({
          ...SessionSchema,
          ...session
        });
      } else {
        // Creating new session
        setFormData({ ...SessionSchema });
      }
    }
    setErrors({});
  }, [isOpen, session]);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const [beansResponse, grindersResponse] = await Promise.all([
        beanAPI.getAllBeans(),
        grinderAPI.getAllGrinders()
      ]);
      
      setBeans(beansResponse.data.data || beansResponse.data);
      setGrinders(grindersResponse.data.data || grindersResponse.data);
    } catch (error) {
      console.error('Error fetching related data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

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
    const validationErrors = validateSessionData(formData);
    if (validationErrors.length > 0) {
      const errorObj = {};
      validationErrors.forEach(error => {
        // Map generic error messages to field-specific ones
        if (error.includes('Bean')) errorObj.bean_id = error;
        if (error.includes('Grinder')) errorObj.grinder_id = error;
        if (error.includes('session date')) errorObj.session_date = error;
      });
      setErrors(errorObj);
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting session:', error);
      setErrors({ submit: error.message || 'An error occurred while saving the session.' });
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
                    {session ? 'Edit Session' : 'Add New Session'}
                  </h3>
                  {isLoadingData ? (
                    <div className="mt-4 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="bean_id" className="block text-sm font-medium text-gray-700">
                          Bean *
                        </label>
                        <select
                          name="bean_id"
                          id="bean_id"
                          value={formData.bean_id || ''}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.bean_id ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        >
                          <option value="">Select a bean</option>
                          {beans.map(bean => (
                            <option key={bean.id} value={bean.id}>
                              {bean.name} - {bean.origin || 'Origin not specified'}
                            </option>
                          ))}
                        </select>
                        {errors.bean_id && <p className="mt-1 text-sm text-red-600">{errors.bean_id}</p>}
                      </div>

                      <div>
                        <label htmlFor="grinder_id" className="block text-sm font-medium text-gray-700">
                          Grinder *
                        </label>
                        <select
                          name="grinder_id"
                          id="grinder_id"
                          value={formData.grinder_id || ''}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.grinder_id ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        >
                          <option value="">Select a grinder</option>
                          {grinders.map(grinder => (
                            <option key={grinder.id} value={grinder.id}>
                              {grinder.name} - {grinder.model || 'Model not specified'}
                            </option>
                          ))}
                        </select>
                        {errors.grinder_id && <p className="mt-1 text-sm text-red-600">{errors.grinder_id}</p>}
                      </div>

                      <div>
                        <label htmlFor="session_date" className="block text-sm font-medium text-gray-700">
                          Session Date *
                        </label>
                        <input
                          type="date"
                          name="session_date"
                          id="session_date"
                          value={formData.session_date || ''}
                          onChange={handleChange}
                          className={`mt-1 block w-full border ${
                            errors.session_date ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.session_date && <p className="mt-1 text-sm text-red-600">{errors.session_date}</p>}
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
                          placeholder="Session notes..."
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              {errors.submit && (
                <div className="mb-2 sm:mb-0 sm:mr-2 text-sm text-red-600">{errors.submit}</div>
              )}
              <button
                type="submit"
                disabled={loading || isLoadingData}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Saving...' : (session ? 'Update Session' : 'Add Session')}
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

export default SessionFormModal;