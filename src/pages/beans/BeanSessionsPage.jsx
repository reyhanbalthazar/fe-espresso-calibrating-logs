import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { beanAPI } from '../../services/api';
import Header from '../../components/common/Header';
import ShotList from '../../components/sessions/ShotList';

const BeanSessionsPage = () => {
  const { beanId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSessions, setExpandedSessions] = useState([]);

  useEffect(() => {
    const fetchBeanSessions = async () => {
      try {
        setLoading(true);
        const response = await beanAPI.getBeanSessions(beanId);
        setSessions(response.data.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load bean sessions');
        console.error('Error fetching bean sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBeanSessions();
  }, [beanId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const toggleSession = (sessionId) => {
    if (expandedSessions.includes(sessionId)) {
      setExpandedSessions(expandedSessions.filter(id => id !== sessionId));
    } else {
      setExpandedSessions([...expandedSessions, sessionId]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Header title="Espresso Calibrator" />

          <div className="mt-10 bg-white rounded-2xl border border-gray-200 shadow-sm p-16 flex flex-col items-center justify-center">
            <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 text-sm">
              Loading calibration sessions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Header title="Espresso Calibrator" />

          <div className="mt-10 bg-white rounded-2xl border border-red-200 shadow-sm p-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M5 12a7 7 0 1114 0 7 7 0 01-14 0z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Failed to Load Sessions
                </h3>
                <p className="mt-2 text-sm text-gray-600">{error}</p>

                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get bean info from the first session (since all sessions belong to the same bean)
  const beanInfo = sessions.length > 0 ? sessions[0].bean : null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Header title="Espresso Calibrator" />

        <div className="mt-10">

          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                {beanInfo ? beanInfo.name : 'Bean Sessions'}
              </h1>
              <p className="text-gray-500 mt-2">
                {sessions.length} calibration session{sessions.length !== 1 ? 's' : ''}
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="inline-flex px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
            >
              ← Back
            </button>
          </div>

          {/* BEAN INFO CARD */}
          {beanInfo && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {beanInfo.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {beanInfo.origin} • {beanInfo.roastery || 'Unknown Roastery'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Roast Level: {beanInfo.roast_level || 'Unknown'}
                  </p>
                </div>

                <span
                  className={`px-4 py-1.5 text-xs rounded-full font-medium ${beanInfo.is_blend
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-green-100 text-green-700'
                    }`}
                >
                  {beanInfo.is_blend ? 'Blend' : 'Single Origin'}
                </span>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {sessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-20 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                No calibration sessions yet
              </h3>
              <p className="text-gray-500 mt-2">
                This bean does not have any recorded sessions.
              </p>
            </div>
          ) : (

            /* SESSIONS TABLE */
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4 text-left">Grinder</th>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Shots</th>
                      <th className="px-6 py-4 text-left">Notes</th>
                      <th className="px-6 py-4 text-right">Expand</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {sessions.map((session) => (
                      <React.Fragment key={session.id}>
                        <tr
                          className="hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => toggleSession(session.id)}
                        >
                          <td className="px-6 py-5">
                            <div className="font-medium text-gray-900">
                              {session.grinder?.name || 'Unknown Grinder'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {session.grinder?.model || 'Model Unknown'}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            {formatDate(session.session_date)}
                          </td>

                          <td className="px-6 py-5">
                            {session.shots?.length || 0}
                          </td>

                          <td className="px-6 py-5 max-w-xs truncate text-gray-600">
                            {session.notes || '-'}
                          </td>

                          <td className="px-6 py-5 text-right">
                            <span className="text-indigo-600 text-sm">
                              {expandedSessions.includes(session.id)
                                ? 'Collapse'
                                : 'Expand'}
                            </span>
                          </td>
                        </tr>

                        {expandedSessions.includes(session.id) && (
                          <tr>
                            <td colSpan="5" className="bg-gray-50 px-6 py-6">
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-xs">
                                  <thead className="text-gray-500 uppercase">
                                    <tr>
                                      <th className="px-3 py-2 text-left">#</th>
                                      <th className="px-3 py-2 text-left">Grind</th>
                                      <th className="px-3 py-2 text-left">Dose</th>
                                      <th className="px-3 py-2 text-left">Yield</th>
                                      <th className="px-3 py-2 text-left">Time</th>
                                      <th className="px-3 py-2 text-left">Temp</th>
                                      <th className="px-3 py-2 text-left">Taste</th>
                                      <th className="px-3 py-2 text-left">Action</th>
                                    </tr>
                                  </thead>

                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    {session.shots.map((shot) => (
                                      <tr key={shot.id}>
                                        <td className="px-3 py-2">{shot.shot_number}</td>
                                        <td className="px-3 py-2">{shot.grind_setting}</td>
                                        <td className="px-3 py-2">{shot.dose}</td>
                                        <td className="px-3 py-2">{shot.yield}</td>
                                        <td className="px-3 py-2">{shot.time_seconds}</td>
                                        <td className="px-3 py-2">{shot.water_temperature}</td>
                                        <td className="px-3 py-2 truncate max-w-xs">
                                          {shot.taste_notes}
                                        </td>
                                        <td className="px-3 py-2 truncate max-w-xs">
                                          {shot.action_taken}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeanSessionsPage;