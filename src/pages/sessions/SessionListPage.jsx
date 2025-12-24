import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionAPI, beanAPI, grinderAPI, shotAPI } from '../../services/api';
import SessionCard from '../../components/sessions/SessionCard';
import SessionFormModal from '../../components/sessions/SessionFormModal';
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

        setSessions(sessionsResponse.data.data || sessionsResponse.data);
        setBeans(beansResponse.data.data || beansResponse.data);
        setGrinders(grindersResponse.data.data || grindersResponse.data);
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
      if (editingSession) {
        // Update existing session
        const response = await sessionAPI.updateSession(editingSession.id, sessionData);
        const updatedSession = response.data.data || response.data;
        setSessions(sessions.map(session =>
          session.id === editingSession.id ? { ...updatedSession, id: editingSession.id } : session
        ));
      } else {
        // Create new session
        const response = await sessionAPI.createSession(sessionData);
        const newSession = response.data.data || response.data;
        setSessions([...sessions, newSession]);
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to save session');
    }
  };

  // Filter sessions based on search term
  const filteredSessions = sessions.filter(session => {
    const searchTermLower = searchTerm.toLowerCase();

    // Find related bean and grinder
    const bean = beans.find(b => b.id === session.bean_id);
    const grinder = grinders.find(g => g.id === session.grinder_id);

    return (
      (bean && bean.name.toLowerCase().includes(searchTermLower)) ||
      (grinder && grinder.name.toLowerCase().includes(searchTermLower)) ||
      (session.session_date && session.session_date.toLowerCase().includes(searchTermLower)) ||
      (session.notes && session.notes.toLowerCase().includes(searchTermLower))
    );
  });

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
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
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
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Session
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSessions.map(session => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      beans={beans}
                      grinders={grinders}
                      onEdit={handleEditSession}
                      onDelete={handleDeleteSession}
                    />
                  ))}
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