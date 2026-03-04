import React, { useState, useEffect } from 'react';
import { SessionSchema, validateSessionData } from '../../types/session';
import { beanAPI, grinderAPI } from '../../services/api';

const SessionFormModal = ({ isOpen, onClose, session, onSubmit }) => {
  const [formData, setFormData] = useState({ ...SessionSchema });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [beans, setBeans] = useState([]);
  const [grinders, setGrinders] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();

      if (session) {
        setFormData({ ...SessionSchema, ...session });
      } else {
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

    const validationErrors = validateSessionData(formData);

    if (validationErrors.length > 0) {
      const errorObj = {};
      validationErrors.forEach(error => {
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
      setErrors({ submit: error.message || 'Error saving session.' });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

        {/* ===== Header ===== */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">
            {session ? 'Edit Calibration Session' : 'New Calibration Session'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Select bean, grinder, and session details
          </p>
        </div>

        {/* ===== Body ===== */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 space-y-6">

            {isLoadingData ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800"></div>
              </div>
            ) : (
              <>
                {/* === Selection Section === */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Equipment & Bean
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bean *
                    </label>
                    <select
                      name="bean_id"
                      value={formData.bean_id || ''}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none ${errors.bean_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select bean</option>
                      {beans.map(bean => (
                        <option key={bean.id} value={bean.id}>
                          {bean.name} — {bean.origin || 'Origin N/A'}
                        </option>
                      ))}
                    </select>
                    {errors.bean_id && (
                      <p className="text-xs text-red-600 mt-1">{errors.bean_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grinder *
                    </label>
                    <select
                      name="grinder_id"
                      value={formData.grinder_id || ''}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none ${errors.grinder_id ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select grinder</option>
                      {grinders.map(grinder => (
                        <option key={grinder.id} value={grinder.id}>
                          {grinder.name} — {grinder.model || 'Model N/A'}
                        </option>
                      ))}
                    </select>
                    {errors.grinder_id && (
                      <p className="text-xs text-red-600 mt-1">{errors.grinder_id}</p>
                    )}
                  </div>
                </div>

                {/* === Schedule Section === */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Session Details
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Date *
                    </label>
                    <input
                      type="date"
                      name="session_date"
                      value={formData.session_date || ''}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none ${errors.session_date ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.session_date && (
                      <p className="text-xs text-red-600 mt-1">{errors.session_date}</p>
                    )}
                  </div>
                </div>

                {/* === Notes Section === */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Notes
                  </h4>
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                    placeholder="Extraction observations, adjustments, taste notes..."
                  />
                </div>
              </>
            )}

            {errors.submit && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {errors.submit}
              </div>
            )}
          </div>

          {/* ===== Footer ===== */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || isLoadingData}
              className="px-4 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Saving...' : session ? 'Update Session' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionFormModal;