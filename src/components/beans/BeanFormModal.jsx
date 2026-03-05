import React, { useState, useEffect } from 'react';
import { BeanSchema, BEAN_ROAST_LEVELS, validateBeanData } from '../../types/bean';
import { COFFEE_ORIGIN_GROUPS, normalizeCoffeeOrigin } from '../../constants/coffeeOrigins';

const BeanFormModal = ({ isOpen, onClose, bean, onSubmit }) => {
  const [formData, setFormData] = useState({ ...BeanSchema });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && bean) {
      // Editing existing bean
      let updatedBean = { ...bean };

      // If it's a blend, split the origin by commas and populate blendOrigins
      if (bean.is_blend && bean.origin) {
        const normalizedOrigins = bean.origin
          .split(',')
          .map((origin) => normalizeCoffeeOrigin(origin))
          .filter(Boolean);
        updatedBean.blendOrigins = normalizedOrigins.length > 0 ? normalizedOrigins : [''];
      } else if (bean.is_blend && !bean.origin) {
        // If it's a blend but no origin, initialize with empty array
        updatedBean.blendOrigins = [''];
      } else if (!bean.is_blend) {
        updatedBean.origin = normalizeCoffeeOrigin(bean.origin);
      }

      setFormData({
        ...BeanSchema,
        ...updatedBean
      });
    } else if (isOpen) {
      // Creating new bean
      setFormData({ ...BeanSchema });
    }
    setErrors({});
  }, [isOpen, bean]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle is_blend field separately to manage the transition between single origin and blend
    if (name === 'is_blend') {
      const isBlend = value === 'true';
      setFormData(prev => {
        if (isBlend && !prev.blendOrigins) {
          // Switching to blend: convert existing origin to blendOrigins array
          const normalized = normalizeCoffeeOrigin(prev.origin);
          return {
            ...prev,
            is_blend: isBlend,
            blendOrigins: normalized ? [normalized] : ['']
          };
        } else if (!isBlend) {
          // Switching to single origin: combine blendOrigins into origin string
          const uniqueOrigins = [...new Set((prev.blendOrigins || [])
            .map((origin) => normalizeCoffeeOrigin(origin))
            .filter(Boolean))]
            .sort((a, b) => a.localeCompare(b));
          return {
            ...prev,
            is_blend: isBlend,
            origin: uniqueOrigins[0] || '',
            blendOrigins: []
          };
        }
        return {
          ...prev,
          is_blend: isBlend
        };
      });

      // Clear error for this field when user selects
      if (errors.is_blend) {
        setErrors(prev => ({
          ...prev,
          is_blend: ''
        }));
      }
    }
    // For non-origin fields (and non-is_blend), use the standard approach
    else if (name !== 'origin') {
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
    }
    // For origin field (when not a blend), update the origin field directly
    else if (name === 'origin' && !formData.is_blend) {
      setFormData(prev => ({
        ...prev,
        origin: value
      }));

      // Clear error for this field when user types
      if (errors.origin) {
        setErrors(prev => ({
          ...prev,
          origin: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Prepare form data for submission
    let submitData = { ...formData };

    // If it's a blend, combine the blendOrigins into a comma-separated origin string
    if (formData.is_blend && formData.blendOrigins && Array.isArray(formData.blendOrigins)) {
      submitData.origin = [...new Set(formData.blendOrigins
        .map((origin) => normalizeCoffeeOrigin(origin))
        .filter(Boolean))]
        .sort((a, b) => a.localeCompare(b))
        .join(', ');
    } else {
      submitData.origin = normalizeCoffeeOrigin(formData.origin);
    }

    // Validate form data
    const validationErrors = validateBeanData(submitData);
    if (validationErrors.length > 0) {
      const errorObj = {};
      validationErrors.forEach(error => {
        // Map generic error messages to field-specific ones
        if (error.includes('Name')) errorObj.name = error;
        if (error.includes('Origin')) errorObj.origin = error;
        if (error.includes('At least one origin is required for blends')) errorObj.origin = error;
        if (error.includes('Roastery')) errorObj.roastery = error;
        if (error.includes('roast level')) errorObj.roast_level = error;
        if (error.includes('roast date')) errorObj.roast_date = error;
        if (error.includes('Bean type')) errorObj.is_blend = error;
      });
      setErrors(errorObj);
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        ...submitData,
        roast_date: submitData.roast_date ? submitData.roast_date : null
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative my-auto w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col">

        <form onSubmit={handleSubmit} className="flex flex-1 min-h-0 flex-col">

          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {bean ? 'Edit Bean' : 'Add New Bean'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage your coffee bean details and roast profile
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
          <div className="px-5 sm:px-8 py-6 space-y-8 flex-1 min-h-0 overflow-y-auto">

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bean Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-xl border px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Ethiopia Guji Natural"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Roastery
                </label>
                <input
                  type="text"
                  name="roastery"
                  value={formData.roastery || ''}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Local Roasters Co."
                />
              </div>
            </div>

            {/* Bean Type */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Bean Type
              </h3>

              <div className="flex space-x-4">
                {['false', 'true'].map(value => {
                  const isBlend = value === 'true';
                  const active = formData.is_blend === isBlend;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          is_blend: isBlend
                        }))
                      }
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${active
                          ? 'bg-amber-100 border-amber-400 text-amber-800'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {isBlend ? 'Blend' : 'Single Origin'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Origin Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Origin Information
              </h3>

              {!formData.is_blend ? (
                <select
                  name="origin"
                  value={formData.origin || ''}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select origin</option>
                  {COFFEE_ORIGIN_GROUPS.map((group) => (
                    <optgroup key={group.region} label={group.region}>
                      {group.producers.map((producer) => (
                        <option key={producer} value={producer}>
                          {producer}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              ) : (
                <div className="space-y-3">
                  {formData.blendOrigins?.map((origin, index) => (
                    <div key={index} className="flex space-x-2">
                      <select
                        value={origin}
                        onChange={(e) => {
                          const newOrigins = [...formData.blendOrigins];
                          newOrigins[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            blendOrigins: newOrigins
                          }));
                        }}
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="">Select origin {index + 1}</option>
                        {COFFEE_ORIGIN_GROUPS.map((group) => (
                          <optgroup key={`${group.region}-${index}`} label={group.region}>
                            {group.producers.map((producer) => (
                              <option key={producer} value={producer}>
                                {producer}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      {formData.blendOrigins.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = formData.blendOrigins.filter((_, i) => i !== index);
                            setFormData(prev => ({
                              ...prev,
                              blendOrigins: filtered
                            }));
                          }}
                          className="px-4 rounded-xl border border-gray-300 text-sm hover:bg-gray-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        blendOrigins: [...(prev.blendOrigins || []), '']
                      }))
                    }
                    className="text-sm font-medium text-amber-700 hover:text-amber-900"
                  >
                    + Add Origin
                  </button>
                </div>
              )}
            </div>

            {/* Roast Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Roast Profile
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <select
                  name="roast_level"
                  value={formData.roast_level}
                  onChange={handleChange}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  {roastLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  name="roast_date"
                  value={formData.roast_date || ''}
                  onChange={handleChange}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Notes
              </h3>
              <textarea
                name="notes"
                rows="3"
                value={formData.notes || ''}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Flavor notes, cupping profile, acidity, body..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-8 py-5 bg-gray-50 border-t flex justify-end space-x-3">
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
              {loading ? 'Saving...' : bean ? 'Update Bean' : 'Add Bean'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeanFormModal;
