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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* HEADER */}
        <Header title={`Espresso Calibrator`} />

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Beans', value: dashboardData?.counts?.beans || 0 },
            { label: 'Grinders', value: dashboardData?.counts?.grinders || 0 },
            { label: 'Sessions', value: dashboardData?.counts?.sessions || 0 },
            { label: 'Shots', value: dashboardData?.counts?.shots || 0 },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-3xl font-semibold text-indigo-600 mt-2">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* CHART GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Monthly Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Monthly Session Activity
            </h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    dashboardData?.monthly_activity?.labels &&
                      dashboardData.monthly_activity.sessions
                      ? dashboardData.monthly_activity.labels.map(
                        (label, index) => ({
                          month: label,
                          sessions:
                            dashboardData.monthly_activity.sessions[index] || 0,
                        })
                      )
                      : []
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="sessions"
                    fill="#6366F1"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grinder Usage */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Grinder Usage
            </h3>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    Array.isArray(dashboardData?.grinder_stats)
                      ? dashboardData.grinder_stats
                      : []
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grinder_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="usage_count"
                    fill="#8B5CF6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* SHOT PERFORMANCE CARDS */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          {dashboardData?.shot_performance?.averages ? (
            [
              {
                label: 'Avg. Dose',
                value: `${dashboardData.shot_performance.averages.dose?.toFixed(
                  2
                ) || 0} g`,
              },
              {
                label: 'Avg. Yield',
                value: `${dashboardData.shot_performance.averages.yield?.toFixed(
                  2
                ) || 0} g`,
              },
              {
                label: 'Avg. Time',
                value: `${dashboardData.shot_performance.averages.time?.toFixed(
                  2
                ) || 0} sec`,
              },
              {
                label: 'Avg. Temp',
                value: `${dashboardData.shot_performance.averages.temperature?.toFixed(
                  0
                ) || 0}°C`,
              },
            ].map((metric, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <p className="text-sm text-gray-500">{metric.label}</p>
                <p className="text-xl font-semibold text-gray-900 mt-2">
                  {metric.value}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500">
              No shot performance data available
            </div>
          )}
        </div>

        {/* RECENT SESSIONS TABLE */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Calibration Sessions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Bean</th>
                  <th className="px-6 py-3 text-left">Grinder</th>
                  <th className="px-6 py-3 text-left">Shots</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {Array.isArray(dashboardData?.recent_sessions) &&
                  dashboardData.recent_sessions.length > 0 ? (
                  dashboardData.recent_sessions.slice(0, 10).map((session, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {session.date
                          ? new Date(session.date).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {session.bean_name}
                      </td>
                      <td className="px-6 py-4">
                        {session.grinder_name}
                      </td>
                      <td className="px-6 py-4">
                        {session.shots_count}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      No recent sessions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;