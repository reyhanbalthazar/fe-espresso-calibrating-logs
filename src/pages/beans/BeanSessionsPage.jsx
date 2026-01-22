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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <Header title="Espresso Calibrator" />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <Header title="Espresso Calibrator" />
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <Header title="Espresso Calibrator" />

        <div className="py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl truncate">
                  {beanInfo ? `${beanInfo.name} Sessions` : 'Bean Sessions'}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {sessions.length} calibration session{sessions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              </div>
            </div>
          </div>

          {/* Bean Info Card */}
          {beanInfo && (
            <div className="mb-6 bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-amber-500 rounded-md p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Bean Information</dt>
                      <dd className="flex items-baseline">
                        <div className="text-lg font-semibold text-gray-900">
                          {beanInfo.name} ({beanInfo.origin})
                        </div>
                      </dd>
                      <dd className="mt-1 text-sm text-gray-500">
                        Roastery: {beanInfo.roastery || 'Unknown'} | Roast Level: {beanInfo.roast_level || 'Unknown'} |{' '}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          beanInfo.is_blend ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {beanInfo.is_blend ? 'Blend' : 'Single Origin'}
                        </span>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sessions List */}
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions</h3>
              <p className="mt-1 text-sm text-gray-500">
                This bean has no calibration sessions yet.
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {/* Desktop/tablet view - horizontal scrolling for small screens */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grinder
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shots
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessions.map(session => (
                      <React.Fragment key={session.id}>
                        <tr
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleSession(session.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {session.grinder?.name || 'Unknown Grinder'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {session.grinder?.model || 'Model Unknown'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(session.session_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {session.shots?.length || 0} shots
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {session.notes || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row click from triggering
                                  toggleSession(session.id);
                                }}
                                className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                                aria-label={expandedSessions.includes(session.id) ? "Collapse shots" : "Expand shots"}
                              >
                                {expandedSessions.includes(session.id) ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 010 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedSessions.includes(session.id) && (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 bg-gray-50">
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Shots for this session</h4>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          #
                                        </th>
                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Grind
                                        </th>
                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Dose (g)
                                        </th>
                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Yield (g)
                                        </th>
                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Time (s)
                                        </th>
                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Temp (°C)
                                        </th>
                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Taste Notes
                                        </th>
                                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Action Taken
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {session.shots.map(shot => (
                                        <tr key={shot.id} className="hover:bg-gray-50">
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {shot.shot_number}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {shot.grind_setting}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {shot.dose}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {shot.yield}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {shot.time_seconds}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {shot.water_temperature}
                                          </td>
                                          <td className="px-3 py-2 text-sm text-gray-900 max-w-xs">
                                            <div className="truncate" title={shot.taste_notes}>
                                              {shot.taste_notes}
                                            </div>
                                          </td>
                                          <td className="px-3 py-2 text-sm text-gray-900 max-w-xs">
                                            <div className="truncate" title={shot.action_taken}>
                                              {shot.action_taken}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view - card layout */}
              <div className="sm:hidden">
                {sessions.map(session => (
                  <div key={session.id} className="border-b border-gray-200 p-4 bg-white">
                    <div
                      className="cursor-pointer"
                      onClick={() => toggleSession(session.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {session.grinder?.name || 'Unknown Grinder'}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {session.grinder?.model || 'Model Unknown'}
                          </div>
                          <div className="text-sm text-gray-900 mt-1">
                            {formatDate(session.session_date)}
                          </div>
                          <div className="text-sm text-gray-900 mt-1">
                            <span className="font-medium">Shots:</span> {session.shots?.length || 0}
                          </div>
                          <div className="text-sm text-gray-900 mt-2">
                            <span className="font-medium">Notes:</span> {session.notes || '-'}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click from triggering
                              toggleSession(session.id);
                            }}
                            className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                            aria-label={expandedSessions.includes(session.id) ? "Collapse shots" : "Expand shots"}
                          >
                            {expandedSessions.includes(session.id) ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 010 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {expandedSessions.includes(session.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Shots for this session</h4>
                          <div className="space-y-3">
                            {session.shots.map(shot => (
                              <div key={shot.id} className="border border-gray-200 rounded-md p-3 bg-white">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div><span className="font-medium">Shot #:</span> {shot.shot_number}</div>
                                  <div><span className="font-medium">Grind:</span> {shot.grind_setting}</div>
                                  <div><span className="font-medium">Dose:</span> {shot.dose}g</div>
                                  <div><span className="font-medium">Yield:</span> {shot.yield}g</div>
                                  <div><span className="font-medium">Time:</span> {shot.time_seconds}s</div>
                                  <div><span className="font-medium">Temp:</span> {shot.water_temperature}°C</div>
                                </div>
                                <div className="mt-2">
                                  <div className="text-sm"><span className="font-medium">Taste Notes:</span> {shot.taste_notes}</div>
                                  <div className="text-sm"><span className="font-medium">Action:</span> {shot.action_taken}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeanSessionsPage;