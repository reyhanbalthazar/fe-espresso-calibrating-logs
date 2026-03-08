import React, { useState, useEffect } from 'react';
import { ShotSchema, validateShotData } from '../../types/shot';
import { flavorWheelAPI } from '../../services/api';

const ShotFormModal = ({ isOpen, onClose, shot, sessionId, onSubmit, existingShots }) => {
  const [formData, setFormData] = useState({ ...ShotSchema });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [flavorWheel, setFlavorWheel] = useState([]);
  const [flavorLoading, setFlavorLoading] = useState(false);
  const [flavorError, setFlavorError] = useState('');
  const [flavorSearch, setFlavorSearch] = useState('');

  useEffect(() => {
    if (isOpen && shot) {
      const selectedFlavorIds = Array.isArray(shot.flavor_note_ids)
        ? shot.flavor_note_ids.map((id) => Number(id)).filter((id) => Number.isInteger(id))
        : Array.isArray(shot.flavor_notes)
          ? shot.flavor_notes.map((note) => Number(note.id)).filter((id) => Number.isInteger(id))
          : [];

      setFormData({
        ...ShotSchema,
        ...shot,
        flavor_note_ids: selectedFlavorIds
      });
    } else if (isOpen) {
      const nextShotNumber = getNextAvailableShotNumber(existingShots || []);
      setFormData({
        ...ShotSchema,
        calibration_session_id: sessionId,
        shot_number: nextShotNumber,
        flavor_note_ids: []
      });
    }
    setErrors({});
    setAiSuggestion('');
    setAiError('');
  }, [isOpen, shot, sessionId, existingShots]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchFlavorWheel = async () => {
      try {
        setFlavorLoading(true);
        setFlavorError('');
        const response = await flavorWheelAPI.getFlavorWheel();
        const payload = response?.data?.data || [];
        setFlavorWheel(Array.isArray(payload) ? payload : []);
      } catch (error) {
        setFlavorError(error?.response?.data?.message || error?.message || 'Failed to load flavor wheel.');
        setFlavorWheel([]);
      } finally {
        setFlavorLoading(false);
      }
    };

    fetchFlavorWheel();
  }, [isOpen]);

  const getNextAvailableShotNumber = (existingShots) => {
    if (!existingShots?.length) return 1;
    const numbers = existingShots
      .map((s) => Number(s.shot_number))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (!numbers.length) return 1;
    return Math.max(...numbers) + 1;
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

  const toggleFlavorNote = (noteId) => {
    const numericId = Number(noteId);
    if (!Number.isInteger(numericId)) return;

    setFormData((prev) => {
      const current = Array.isArray(prev.flavor_note_ids) ? prev.flavor_note_ids : [];
      const exists = current.includes(numericId);
      return {
        ...prev,
        flavor_note_ids: exists
          ? current.filter((id) => id !== numericId)
          : [...current, numericId]
      };
    });
  };

  const clearAllFlavorNotes = () => {
    setFormData((prev) => ({ ...prev, flavor_note_ids: [] }));
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

    if (!shot && existingShots?.some((s) => Number(s.shot_number) === Number(formData.shot_number))) {
      setErrors({ shot_number: `Shot number ${formData.shot_number} already exists.` });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        flavor_note_ids: [...new Set((formData.flavor_note_ids || [])
          .map((id) => Number(id))
          .filter((id) => Number.isInteger(id)))]
      };

      await onSubmit(payload);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save shot.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setAiSuggestion('');
    setAiError('');
    setFlavorSearch('');
    onClose();
  };

  const handleGenerateAiSuggestion = async () => {
    const selectedFlavors = selectedFlavorNotes.map((note) => note.name).filter(Boolean);
    const additionalNotes = (formData.taste_notes || '').trim();

    if (selectedFlavors.length === 0) {
      setAiError('Please select Flavor Notes first.');
      setAiSuggestion('');
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setAiError('VITE_GEMINI_API_KEY is not set.');
      setAiSuggestion('');
      return;
    }

    setAiLoading(true);
    setAiError('');

    try {
      const prompt = `You are a barista coach. Based on this shot data:
          - Flavor notes (selected): ${selectedFlavors.join(', ')}
          - Additional taste notes: ${additionalNotes || '-'}
          - Dose: ${formData.dose || '-'} g
          - Yield: ${formData.yield || '-'} g
          - Time: ${formData.time_seconds || '-'} s
          - Water temp: ${formData.water_temperature || '-'} C

          Give short practical calibration advice in 2-4 bullet points.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!response.ok || !text) {
        throw new Error(data?.error?.message || 'Failed to generate AI suggestion.');
      }

      setAiSuggestion(text);
    } catch (err) {
      setAiSuggestion('');
      setAiError(err.message || 'Failed to generate AI suggestion.');
    } finally {
      setAiLoading(false);
    }
  };

  if (!isOpen) return null;

  const allNotes = flavorWheel.flatMap((category) =>
    (category.subcategories || []).flatMap((subcategory) =>
      (subcategory.notes || []).map((note) => ({
        id: note.id,
        name: note.name,
        categoryName: category.name,
        subcategoryName: subcategory.name,
      }))
    )
  );

  const selectedFlavorIds = Array.isArray(formData.flavor_note_ids) ? formData.flavor_note_ids : [];
  const selectedFlavorNotes = allNotes.filter((note) => selectedFlavorIds.includes(note.id));
  const isFlavorSelected = (id) => selectedFlavorIds.includes(Number(id));

  const searchTerm = flavorSearch.trim().toLowerCase();
  const filteredWheel = !searchTerm
    ? flavorWheel
    : flavorWheel
      .map((category) => {
        const categoryMatches = category.name.toLowerCase().includes(searchTerm);
        const categoryOverallMatches = (category.overall_note?.name || '').toLowerCase().includes(searchTerm);
        const subcategories = (category.subcategories || [])
          .map((subcategory) => {
            const subcategoryMatches = subcategory.name.toLowerCase().includes(searchTerm);
            const subcategoryOverallMatches = (subcategory.overall_note?.name || '').toLowerCase().includes(searchTerm);
            const notes = (subcategory.notes || []).filter((note) => {
              return (
                categoryMatches ||
                categoryOverallMatches ||
                subcategoryMatches ||
                subcategoryOverallMatches ||
                note.name.toLowerCase().includes(searchTerm)
              );
            });

            if (subcategoryMatches && notes.length === 0) {
              return { ...subcategory, notes: subcategory.notes || [] };
            }

            return { ...subcategory, notes };
          })
          .filter((subcategory) => {
            return (
              categoryMatches ||
              categoryOverallMatches ||
              subcategory.name.toLowerCase().includes(searchTerm) ||
              (subcategory.overall_note?.name || '').toLowerCase().includes(searchTerm) ||
              (subcategory.notes || []).length > 0
            );
          });

        return { ...category, subcategories };
      })
      .filter((category) =>
        category.subcategories.length > 0 ||
        category.name.toLowerCase().includes(searchTerm) ||
        (category.overall_note?.name || '').toLowerCase().includes(searchTerm)
      );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col">

        {/* Header */}
        <div className="px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {shot ? 'Edit Shot' : 'Add New Shot'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Record extraction parameters and evaluation for this calibration session.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 min-h-0 flex-col">
          <div className="p-5 sm:p-6 space-y-8 flex-1 min-h-0 overflow-y-auto">

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
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="form-label !mb-0">Flavor Notes (Flavor Wheel)</label>
                    {selectedFlavorIds.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAllFlavorNotes}
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <p className="helper-text mb-2">Choose one or more flavor notes for consistent tagging.</p>
                  <input
                    type="text"
                    value={flavorSearch}
                    onChange={(e) => setFlavorSearch(e.target.value)}
                    className="form-input"
                    placeholder="Search notes, subcategories, or categories..."
                  />

                  {selectedFlavorNotes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedFlavorNotes.map((note) => (
                        <button
                          key={note.id}
                          type="button"
                          onClick={() => toggleFlavorNote(note.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800 border border-indigo-200 hover:bg-indigo-200"
                        >
                          <span>{note.name}</span>
                          <span aria-hidden="true">&times;</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 border border-gray-200 rounded-xl p-3 max-h-64 overflow-y-auto bg-gray-50">
                    {flavorLoading && (
                      <p className="text-sm text-gray-500">Loading flavor wheel...</p>
                    )}

                    {!flavorLoading && flavorError && (
                      <div className="text-sm text-red-600">
                        {flavorError}
                      </div>
                    )}

                    {!flavorLoading && !flavorError && filteredWheel.length === 0 && (
                      <p className="text-sm text-gray-500">No flavor note found.</p>
                    )}

                    {!flavorLoading && !flavorError && filteredWheel.length > 0 && (
                      <div className="space-y-3">
                        {filteredWheel.map((category) => (
                          <div key={category.id} className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-semibold text-gray-900">{category.name}</h4>
                              {category.overall_note && (
                                <button
                                  type="button"
                                  onClick={() => toggleFlavorNote(category.overall_note.id)}
                                  className={`px-2 py-1 rounded-full text-[11px] border transition ${isFlavorSelected(category.overall_note.id)
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    }`}
                                >
                                  Basic: {category.name}
                                </button>
                              )}
                            </div>
                            <div className="mt-2 space-y-2">
                              {(category.subcategories || []).map((subcategory) => (
                                <div key={subcategory.id}>
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                      {subcategory.name}
                                    </p>
                                    {subcategory.overall_note && (
                                      <button
                                        type="button"
                                        onClick={() => toggleFlavorNote(subcategory.overall_note.id)}
                                        className={`px-2 py-1 rounded-full text-[11px] border transition ${isFlavorSelected(subcategory.overall_note.id)
                                          ? 'bg-sky-600 text-white border-sky-600'
                                          : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                                          }`}
                                      >
                                        Basic: {subcategory.name}
                                      </button>
                                    )}
                                  </div>
                                  {(subcategory.notes || []).filter((note) => !note.is_overall).length === 0 ? (
                                    <p className="text-xs text-gray-400 mt-1">No selectable notes.</p>
                                  ) : (
                                    <div className="mt-1 flex flex-wrap gap-2">
                                      {subcategory.notes
                                        .filter((note) => !note.is_overall)
                                        .map((note) => {
                                        const checked = isFlavorSelected(note.id);
                                        return (
                                          <button
                                            key={note.id}
                                            type="button"
                                            onClick={() => toggleFlavorNote(note.id)}
                                            className={`px-2.5 py-1 rounded-full text-xs border transition ${checked
                                              ? 'bg-indigo-600 text-white border-indigo-600'
                                              : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-700'
                                              }`}
                                          >
                                            {note.name}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="form-label">Additional Taste Notes</label>
                    <textarea
                      name="taste_notes"
                      rows="3"
                      value={formData.taste_notes || ''}
                      onChange={handleChange}
                      className="form-input resize-none"
                      placeholder="Optional free-text notes (balance, body, defects, etc.)"
                    />
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleGenerateAiSuggestion}
                      disabled={aiLoading}
                      className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      {aiLoading ? 'Thinking...' : 'Get AI Suggestion'}
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
                      Select Flavor Notes first. Additional Taste Notes are optional context.
                    </p>
                  </div>
                  {aiError && (
                    <p className="mt-2 text-xs text-red-600">{aiError}</p>
                  )}
                  {aiSuggestion && (
                    <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2">
                      <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">
                        AI Suggestion
                      </p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {aiSuggestion}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            action_taken: prev.action_taken
                              ? `${prev.action_taken}\n${aiSuggestion}`
                              : aiSuggestion
                          }))
                        }
                        className="mt-3 px-3 py-2 rounded-lg text-sm border border-indigo-300 text-indigo-700 bg-white hover:bg-indigo-50 transition"
                      >
                        Use Suggestion in Action Taken
                      </button>
                    </div>
                  )}
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
          <div className="px-5 sm:px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
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
              className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
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
