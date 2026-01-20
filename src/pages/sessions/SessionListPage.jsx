import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionAPI, beanAPI, grinderAPI, shotAPI } from '../../services/api';
import SessionFormModal from '../../components/sessions/SessionFormModal';
import ShotList from '../../components/sessions/ShotList';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/common/Header';

const SessionListPage = () => {
  const [sessions, setSessions] = useState([]);
  const [beans, setBeans] = useState([]);
  const [grinders, setGrinders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: new Date().toISOString().split('T')[0] // Default to today's date
  });
  const [expandedSessions, setExpandedSessions] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated, checkingAuthStatus } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!checkingAuthStatus && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, checkingAuthStatus, navigate]);

  useEffect(() => {
    if (!isAuthenticated || checkingAuthStatus) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setDataLoading(true);

        // Fetch sessions, beans, and grinders in parallel
        const [sessionsResponse, beansResponse, grindersResponse] = await Promise.all([
          sessionAPI.getAllSessions(),
          beanAPI.getAllBeans(),
          grinderAPI.getAllGrinders()
        ]);

        console.log('Beans API response:', beansResponse);
        console.log('Beans data:', beansResponse.data);

        // Handle different response structures
        let sessionsData = sessionsResponse.data;
        let beansData = beansResponse.data;
        let grindersData = grindersResponse.data;

        // Check if data is nested in a data property
        if (sessionsResponse.data && sessionsResponse.data.data) {
          sessionsData = sessionsResponse.data.data;
        }
        if (beansResponse.data && beansResponse.data.data) {
          beansData = beansResponse.data.data;
        }
        if (grindersResponse.data && grindersResponse.data.data) {
          grindersData = grindersResponse.data.data;
        }

        console.log('Processed beans data:', beansData);
        console.log('First bean item:', beansData[0]);

        // Enrich sessions with bean and grinder data
        const enrichedSessions = sessionsData.map(session => {
          const bean = beansData.find(b => b.id === session.bean_id);
          const grinder = grindersData.find(g => g.id === session.grinder_id);

          return {
            ...session,
            bean,  // Attach the full bean object
            grinder  // Attach the full grinder object
          };
        });

        console.log('Enriched sessions:', enrichedSessions);

        setSessions(enrichedSessions || []);
        setBeans(beansData || []);
        setGrinders(grindersData || []);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
        setDataLoading(false);
      }
    };

    fetchAllData();
  }, [isAuthenticated, checkingAuthStatus]);

  const handleAddSession = () => {
    setEditingSession(null);
    setShowFormModal(true);
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setShowFormModal(true);
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await sessionAPI.deleteSession(sessionId);
      setSessions(sessions.filter(session => session.id !== sessionId));
    } catch (err) {
      setError(err.message || 'Failed to delete session');
      console.error('Error deleting session:', err);
    }
  };

  const handleFormSubmit = async (sessionData) => {
    try {
      let response;
      if (editingSession) {
        // Update existing session
        response = await sessionAPI.updateSession(editingSession.id, sessionData);
        const updatedSession = response.data.data || response.data;
        setSessions(sessions.map(session =>
          session.id === editingSession.id ? { ...updatedSession, id: editingSession.id } : session
        ));
      } else {
        // Create new session
        response = await sessionAPI.createSession(sessionData);
        const newSession = response.data.data || response.data;

        console.log('New session created:', newSession);

        // Create an enriched session with bean and grinder data
        // First, try to find the bean and grinder from our existing state
        const existingBean = beans.find(b => b.id === newSession.bean_id);
        const existingGrinder = grinders.find(g => g.id === newSession.grinder_id);

        console.log('Found existing bean:', existingBean);
        console.log('Found existing grinder:', existingGrinder);

        let beanData = existingBean;
        let grinderData = existingGrinder;

        // If we don't have it in existing state, fetch it
        if (!beanData) {
          console.log('Fetching bean data...');
          try {
            const beanResponse = await beanAPI.getBeanById(newSession.bean_id);
            console.log('Bean API response:', beanResponse);
            beanData = beanResponse.data.data || beanResponse.data || beanResponse;
            console.log('Extracted bean data:', beanData);
          } catch (err) {
            console.error('Error fetching bean:', err);
          }
        }

        if (!grinderData) {
          console.log('Fetching grinder data...');
          try {
            const grinderResponse = await grinderAPI.getGrinderById(newSession.grinder_id);
            console.log('Grinder API response:', grinderResponse);
            grinderData = grinderResponse.data.data || grinderResponse.data || grinderResponse;
            console.log('Extracted grinder data:', grinderData);
          } catch (err) {
            console.error('Error fetching grinder:', err);
          }
        }

        const enrichedNewSession = {
          ...newSession,
          bean: beanData,  // Use 'bean' instead of 'bean_data' for consistency
          grinder: grinderData  // Use 'grinder' instead of 'grinder_data'
        };

        console.log('Enriched session to be added:', enrichedNewSession);

        // Add the enriched session to the list
        setSessions(prevSessions => [enrichedNewSession, ...prevSessions]);
      }

      setShowFormModal(false);
      setEditingSession(null);
    } catch (err) {
      console.error('Error in handleFormSubmit:', err);
      throw new Error(err.response?.data?.message || err.message || 'Failed to save session');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Filter and sort sessions
  const filteredSessions = sessions
    .filter(session => {
      // Date range filtering
      const sessionDate = new Date(session.session_date);
      const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
      const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

      const dateMatch = (!startDate || sessionDate >= startDate) &&
        (!endDate || sessionDate <= endDate);

      // Search term filtering
      const searchTermLower = searchTerm.toLowerCase();
      const bean = beans.find(b => b.id === session.bean_id);
      const grinder = grinders.find(g => g.id === session.grinder_id);

      const searchMatch = !searchTerm ||
        (bean && bean.name.toLowerCase().includes(searchTermLower)) ||
        (grinder && grinder.name.toLowerCase().includes(searchTermLower)) ||
        (session.session_date && session.session_date.toLowerCase().includes(searchTermLower)) ||
        (session.notes && session.notes.toLowerCase().includes(searchTermLower));

      return dateMatch && searchMatch;
    })
    .sort((a, b) => new Date(b.session_date) - new Date(a.session_date)); // Sort by date (newest first)

  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <Header title="Espresso Calibrator" />

        <div className="py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl truncate">
                  Calibration Sessions
                </h1>
                <p className="mt-1 text-sm text-gray-500 hidden sm:block">
                  Manage your espresso calibration sessions
                </p>
                <p className="mt-1 text-sm text-gray-500 sm:hidden">
                  Manage sessions
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddSession}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 sm:hidden" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Add Session</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="mb-6">
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.416l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2 border-gray-300 rounded-md"
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Date range filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-3 border-gray-300 rounded-md shadow-sm"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-3 border-gray-300 rounded-md shadow-sm"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Reset date filters button */}
              {(dateRange.startDate || dateRange.endDate) && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setDateRange({ startDate: '', endDate: '' })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear Date Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
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
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="mb-6 bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Sessions</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{filteredSessions.length}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session list */}
              {filteredSessions.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new calibration session.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handleAddSession}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 010 2h-3v3a1 1 0 01-2 0v-3H6a1 1 0 010-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Session
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  {/* Desktop/tablet view - horizontal scrolling for small screens */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bean & Grinder
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
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
                        {filteredSessions.map(session => {
                          // Check for both naming conventions
                          const bean = session.bean || session.bean_data || beans.find(b => b.id === session.bean_id);
                          const grinder = session.grinder || session.grinder_data || grinders.find(g => g.id === session.grinder_id);

                          console.log('Session ID:', session.id);
                          console.log('Session bean_id:', session.bean_id);
                          console.log('Found bean:', bean);
                          console.log('Bean name:', bean?.name);
                          console.log('All beans in state:', beans);

                          return (
                            <Fragment key={session.id}>
                              <tr
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                  const currentExpanded = expandedSessions.includes(session.id);
                                  if (currentExpanded) {
                                    setExpandedSessions(expandedSessions.filter(id => id !== session.id));
                                  } else {
                                    setExpandedSessions([...expandedSessions, session.id]);
                                  }
                                }}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {bean && typeof bean === 'object' && bean.name
                                      ? bean.name
                                      : `Unknown Bean (ID: ${session.bean_id})`}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {grinder && typeof grinder === 'object' && grinder.name
                                      ? grinder.name
                                      : 'Unknown Grinder'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {formatDate(session.session_date)}
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
                                        const currentExpanded = expandedSessions.includes(session.id);
                                        if (currentExpanded) {
                                          setExpandedSessions(expandedSessions.filter(id => id !== session.id));
                                        } else {
                                          setExpandedSessions([...expandedSessions, session.id]);
                                        }
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
                                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 010 2h-3v3a1 1 0 01-2 0v-3H6a1 1 0 010-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent row click from triggering
                                        handleEditSession(session);
                                      }}
                                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                      aria-label="Edit session"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent row click from triggering
                                        handleDeleteSession(session.id);
                                      }}
                                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                      aria-label="Delete session"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {expandedSessions.includes(session.id) && (
                                <tr>
                                  <td colSpan="4" className="px-6 py-4 bg-gray-50">
                                    <ShotList sessionId={session.id} sessionDate={session.session_date} />
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile view - card layout */}
                  <div className="sm:hidden">
                    {filteredSessions.map(session => {
                      // Check for both naming conventions
                      const bean = session.bean || session.bean_data || beans.find(b => b.id === session.bean_id);
                      const grinder = session.grinder || session.grinder_data || grinders.find(g => g.id === session.grinder_id);

                      return (
                        <div key={session.id} className="border-b border-gray-200 p-4 bg-white">
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              const currentExpanded = expandedSessions.includes(session.id);
                              if (currentExpanded) {
                                setExpandedSessions(expandedSessions.filter(id => id !== session.id));
                              } else {
                                setExpandedSessions([...expandedSessions, session.id]);
                              }
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">
                                  {bean && typeof bean === 'object' && bean.name
                                    ? bean.name
                                    : `Unknown Bean (ID: ${session.bean_id})`}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {grinder && typeof grinder === 'object' && grinder.name
                                    ? grinder.name
                                    : 'Unknown Grinder'}
                                </div>
                                <div className="text-sm text-gray-900 mt-1">
                                  {formatDate(session.session_date)}
                                </div>
                                <div className="text-sm text-gray-900 mt-2">
                                  <span className="font-medium">Notes:</span> {session.notes || '-'}
                                </div>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row click from triggering
                                    const currentExpanded = expandedSessions.includes(session.id);
                                    if (currentExpanded) {
                                      setExpandedSessions(expandedSessions.filter(id => id !== session.id));
                                    } else {
                                      setExpandedSessions([...expandedSessions, session.id]);
                                    }
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
                                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 010 2h-3v3a1 1 0 01-2 0v-3H6a1 1 0 010-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row click from triggering
                                    handleEditSession(session);
                                  }}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                  aria-label="Edit session"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row click from triggering
                                    handleDeleteSession(session.id);
                                  }}
                                  className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                  aria-label="Delete session"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {expandedSessions.includes(session.id) && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <ShotList sessionId={session.id} sessionDate={session.session_date} />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Form Modal */}
          <SessionFormModal
            isOpen={showFormModal}
            onClose={() => setShowFormModal(false)}
            session={editingSession}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default SessionListPage;