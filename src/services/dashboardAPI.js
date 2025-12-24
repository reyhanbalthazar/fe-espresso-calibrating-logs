import api from './api';

export const dashboardAPI = {
  // Get all data for dashboard
  getDashboardData: async () => {
    try {
      const [
        beansResponse,
        grindersResponse,
        sessionsResponse,
        shotsResponse
      ] = await Promise.all([
        api.get('/beans'),
        api.get('/grinders'),
        api.get('/calibration-sessions'),
        api.get('/shots') // Get all shots to analyze trends
      ]);

      return {
        beans: beansResponse.data,
        grinders: grindersResponse.data,
        sessions: sessionsResponse.data,
        shots: shotsResponse.data,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Get shots data for specific session
  getShotsForSession: async (sessionId) => {
    try {
      const response = await api.get(`/calibration-sessions/${sessionId}/shots`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching shots for session ${sessionId}:`, error);
      throw error;
    }
  },

  // Get sessions for a specific bean
  getSessionsForBean: async (beanId) => {
    try {
      const response = await api.get(`/beans/${beanId}/sessions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sessions for bean ${beanId}:`, error);
      throw error;
    }
  },

  // Get shots with session and bean details
  getShotsWithDetails: async () => {
    try {
      // Get all sessions to then get shots for each
      const sessionsResponse = await api.get('/calibration-sessions');
      const sessions = sessionsResponse.data.data || sessionsResponse.data;

      // Get shots for each session
      const allShots = [];
      for (const session of sessions) {
        try {
          const shotsResponse = await api.get(`/calibration-sessions/${session.id}/shots`);
          const shots = shotsResponse.data;

          // Add session and bean details to each shot
          shots.forEach(shot => {
            allShots.push({
              ...shot,
              session_date: session.session_date,
              bean_name: session.bean?.name || 'Unknown',
              bean_origin: session.bean?.origin || 'Unknown',
              grinder_name: session.grinder?.name || 'Unknown',
            });
          });
        } catch (error) {
          console.error(`Error fetching shots for session ${session.id}:`, error);
        }
      }

      return allShots;
    } catch (error) {
      console.error('Error fetching shots with details:', error);
      throw error;
    }
  },

  // NEW VISUALIZATION ENDPOINTS
  // Get extraction trends data
  getExtractionTrends: async () => {
    try {
      const response = await api.get('/visualization/extraction-trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching extraction trends:', error);
      throw error;
    }
  },

  // Get comparative analysis data
  getComparativeAnalysis: async () => {
    try {
      const response = await api.get('/visualization/comparative-analysis');
      return response.data;
    } catch (error) {
      console.error('Error fetching comparative analysis:', error);
      throw error;
    }
  },

  // Get optimal parameters data
  getOptimalParameters: async () => {
    try {
      const response = await api.get('/visualization/optimal-parameters');
      return response.data;
    } catch (error) {
      console.error('Error fetching optimal parameters:', error);
      throw error;
    }
  },

  // Get summary statistics
  getSummaryStats: async () => {
    try {
      const response = await api.get('/visualization/summary-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching summary stats:', error);
      throw error;
    }
  }
};