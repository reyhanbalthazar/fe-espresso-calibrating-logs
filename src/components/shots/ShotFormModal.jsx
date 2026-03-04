import React, { useState, useEffect } from 'react';
import { ShotSchema, validateShotData } from '../../types/shot';

const ShotFormModal = ({ isOpen, onClose, shot, sessionId, onSubmit, existingShots }) => {
  const [formData, setFormData] = useState({ ...ShotSchema });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && shot) {
      setFormData({
        ...ShotSchema,
        ...shot
      });
    } else if (isOpen) {
      const nextShotNumber = getNextAvailableShotNumber(existingShots || []);
      setFormData({
        ...ShotSchema,
        calibration_session_id: sessionId,
        shot_number: nextShotNumber
      });
    }
    setErrors({});
  }, [isOpen, shot, sessionId, existingShots]);

  const getNextAvailableShotNumber = (existingShots) => {
    if (!existingShots?.length) return 1;
    const numbers = existingShots.map(s => s.shot_number);
    let i = 1;
    while (numbers.includes(i)) i++;
    return i;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;
    if (['dose', 'yield', 'time_seconds', 'shot_number', 'water_temperature'].includes(name)) {
      processedValue = value === '' ? null : Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

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
        if (error.includes('Water temperature')) errorObj.water_temperature = error;
      });
      setErrors(errorObj);
      setLoading(false);
      return;
    }

    if (!shot && existingShots?.some(s => s.shot_number === formData.shot_number)) {
      setErrors({ shot_number: `Shot number ${formData.shot_number} already exists.` });
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save shot.' });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {shot ? 'Edit Shot' : 'Add New Shot'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Record extraction parameters and evaluation for this calibration session.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">

            {/* Shot Info */}
            <section>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">
                Shot Info
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Shot Number *</label>
                  <input
                    type="number"
                    name="shot_number"
                    value={formData.shot_number || ''}
                    onChange={handleChange}
                    disabled={!!shot}
                    min="1"
                    className={`form-input ${errors.shot_number ? 'input-error' : ''} ${shot ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  {errors.shot_number && <p className="error-text">{errors.shot_number}</p>}
                  {!shot && (
                    <p className="helper-text">Automatically assigned sequentially.</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Grind Setting *</label>
                  <input
                    type="text"
                    name="grind_setting"
                    value={formData.grind_setting || ''}
                    onChange={handleChange}
                    className={`form-input ${errors.grind_setting ? 'input-error' : ''}`}
                    placeholder="e.g. 15"
                  />
                  {errors.grind_setting && <p className="error-text">{errors.grind_setting}</p>}
                </div>
              </div>
            </section>

            {/* Extraction Parameters */}
            <section>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">
                Extraction Parameters
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <label className="form-label">Dose (g) *</label>
                  <input
                    type="number"
                    name="dose"
                    value={formData.dose || ''}
                    onChange={handleChange}
                    step="0.01"
                    className={`form-input ${errors.dose ? 'input-error' : ''}`}
                  />
                  {errors.dose && <p className="error-text">{errors.dose}</p>}
                </div>

                <div>
                  <label className="form-label">Yield (g) *</label>
                  <input
                    type="number"
                    name="yield"
                    value={formData.yield || ''}
                    onChange={handleChange}
                    step="0.01"
                    className={`form-input ${errors.yield ? 'input-error' : ''}`}
                  />
                  {errors.yield && <p className="error-text">{errors.yield}</p>}
                </div>

                <div>
                  <label className="form-label">Time (s) *</label>
                  <input
                    type="number"
                    name="time_seconds"
                    value={formData.time_seconds || ''}
                    onChange={handleChange}
                    className={`form-input ${errors.time_seconds ? 'input-error' : ''}`}
                  />
                  {errors.time_seconds && <p className="error-text">{errors.time_seconds}</p>}
                </div>

                <div>
                  <label className="form-label">Water Temp (°C)</label>
                  <input
                    type="number"
                    name="water_temperature"
                    value={formData.water_temperature || ''}
                    onChange={handleChange}
                    step="0.1"
                    className={`form-input ${errors.water_temperature ? 'input-error' : ''}`}
                  />
                  {errors.water_temperature && <p className="error-text">{errors.water_temperature}</p>}
                  <p className="helper-text">Typical espresso range: 90–96°C</p>
                </div>
              </div>
            </section>

            {/* Evaluation */}
            <section>
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">
                Evaluation
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Taste Notes</label>
                  <textarea
                    name="taste_notes"
                    rows="3"
                    value={formData.taste_notes || ''}
                    onChange={handleChange}
                    className="form-input resize-none"
                    placeholder="Flavor balance, acidity, body, defects..."
                  />
                </div>

                <div>
                  <label className="form-label">Action Taken</label>
                  <textarea
                    name="action_taken"
                    rows="3"
                    value={formData.action_taken || ''}
                    onChange={handleChange}
                    className="form-input resize-none"
                    placeholder="Adjustment made for next shot..."
                  />
                </div>
              </div>
            </section>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : (shot ? 'Update Shot' : 'Add Shot')}
            </button>
          </div>
        </form>
      </div>

      {/* Shared Styles */}
      <style jsx>{`
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        .form-input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          padding: 0.6rem 0.9rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .form-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
        .input-error {
          border-color: #ef4444;
        }
        .error-text {
          font-size: 0.75rem;
          color: #ef4444;
          margin-top: 0.25rem;
        }
        .helper-text {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default ShotFormModal;