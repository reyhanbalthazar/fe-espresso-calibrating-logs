import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { dashboardAPI } from '../../services/api';
import Header from '../../components/common/Header';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch comprehensive dashboard data
        const data = await dashboardAPI.getDashboardData();
        setDashboardData(data);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <Header title="Loading Dashboard..." />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-base sm:text-lg">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <Header title="Dashboard Error" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Prepare extraction trends data for chart from shot performance data
  const extractionTrendsData = Array.isArray(dashboardData?.shot_performance?.last_session_shots) ?
    dashboardData.shot_performance.last_session_shots : [];

  // Create extractionByBean from bean_stats if available, otherwise use empty array
  const extractionByBean = Array.isArray(dashboardData?.bean_stats) ?
    dashboardData.bean_stats.map(bean => ({
      bean_name: bean.bean_name,
      session_count: bean.session_count
    })) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <Header title={`Welcome, ${dashboardData?.user?.name || 'Espresso Professional'}`} />

        <main className="mt-6 sm:mt-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">Beans</h3>
              <p className="text-2xl sm:text-3xl font-bold text-amber-600">{dashboardData?.counts?.beans || 0}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">Grinders</h3>
              <p className="text-2xl sm:text-3xl font-bold text-amber-600">{dashboardData?.counts?.grinders || 0}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">Sessions</h3>
              <p className="text-2xl sm:text-3xl font-bold text-amber-600">{dashboardData?.counts?.sessions || 0}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">Shots</h3>
              <p className="text-2xl sm:text-3xl font-bold text-amber-600">{dashboardData?.counts?.shots || 0}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">Coffee Shop</h3>
              <p className="text-2xl sm:text-3xl font-bold text-amber-600">{dashboardData?.user?.coffee_shop_id || 0}</p>
            </div>
          </div>

          {/* Taste Profile Insights */}
          {dashboardData?.taste_profile && dashboardData.taste_profile.common_flavors && dashboardData.taste_profile.common_flavors.length > 0 && (
            <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Taste Profile Insights:</strong> Common flavors detected: {dashboardData.taste_profile.common_flavors.slice(0, 5).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Charts Grid - Enhanced Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Monthly Activity - Sessions */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Monthly Session Activity</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      dashboardData?.monthly_activity?.labels && dashboardData.monthly_activity.sessions ?
                      dashboardData.monthly_activity.labels.map((label, index) => ({
                        month: label,
                        sessions: dashboardData.monthly_activity.sessions[index] || 0,
                        shots: dashboardData.monthly_activity.shots[index] || 0
                      })) : []
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sessions" name="Sessions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grinder Usage */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Grinder Usage Statistics</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Array.isArray(dashboardData?.grinder_stats) ? dashboardData.grinder_stats : []}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grinder_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="usage_count" name="Usage Count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bean Statistics */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Bean Session Statistics</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Array.isArray(dashboardData?.bean_stats) ? dashboardData.bean_stats : []}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 50,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bean_name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="session_count" name="Session Count" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Additional Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
            {/* Flavor Profile Distribution */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Flavor Profile Distribution</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        dashboardData?.taste_profile?.flavor_categories ?
                        Object.entries(dashboardData.taste_profile.flavor_categories).map(([name, value]) => ({ name, value })) : []
                      }
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.keys(dashboardData?.taste_profile?.flavor_categories || {}).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Shot Performance */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Shot Performance Metrics</h3>
              <div className="space-y-4">
                {dashboardData?.shot_performance?.averages ? (
                  <>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-medium text-amber-800">Avg. Dose</h4>
                      <p className="text-gray-700">
                        {(dashboardData.shot_performance.averages.dose || 0).toFixed(2)} g
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800">Avg. Yield</h4>
                      <p className="text-gray-700">
                        {(dashboardData.shot_performance.averages.yield || 0).toFixed(2)} g
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800">Avg. Extraction Time</h4>
                      <p className="text-gray-700">
                        {(dashboardData.shot_performance.averages.time || 0).toFixed(2)} sec
                      </p>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-800">Avg. Temperature</h4>
                      <p className="text-gray-700">
                        {(dashboardData.shot_performance.averages.temperature || 0).toFixed(0)}°C
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-8">No shot performance data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-xl shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Recent Calibration Sessions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bean</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grinder</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shots</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(dashboardData?.recent_sessions) ? dashboardData.recent_sessions.slice(0, 10).map((session, index) => (
                    <tr key={index}>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.date ? new Date(session.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {session.bean_name}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.grinder_name}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.notes}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.shots_count}
                      </td>
                    </tr>
                  )) : <tr><td colSpan="5" className="px-3 sm:px-6 py-4 text-center text-sm text-gray-500">No recent sessions</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;