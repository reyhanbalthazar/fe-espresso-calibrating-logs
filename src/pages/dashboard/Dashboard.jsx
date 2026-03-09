import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
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
        const data = await dashboardAPI.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <Header title="Loading Dashboard..." />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto" />
              <p className="mt-4 text-slate-600 text-base sm:text-lg">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <Header title="Dashboard Error" />
          <div className="flex items-center justify-center h-64">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0EA5E9', '#16A34A'];

  const summary = dashboardData?.summary || {};
  const performance = dashboardData?.performance || {};
  const trend = dashboardData?.activity_trend || {};
  const tasteProfile = dashboardData?.taste_profile || {};

  const recentSessions = Array.isArray(dashboardData?.recent_sessions) ? dashboardData.recent_sessions : [];
  const beanStats = Array.isArray(dashboardData?.bean_stats) ? dashboardData.bean_stats : [];
  const grinderStats = Array.isArray(dashboardData?.grinder_stats) ? dashboardData.grinder_stats : [];
  const contributors = Array.isArray(dashboardData?.contributors) ? dashboardData.contributors : [];

  const activityChartData = Array.isArray(trend.labels)
    ? trend.labels.map((label, index) => ({
      month: label,
      sessions: trend.sessions?.[index] || 0,
      shots: trend.shots?.[index] || 0,
    }))
    : [];

  const flavorCategoryData = Object.entries(tasteProfile.flavor_categories || {})
    .map(([name, value]) => ({ name, value }))
    .slice(0, 7);

  const topNotes = Array.isArray(tasteProfile.top_notes)
    ? tasteProfile.top_notes
    : Object.entries(tasteProfile.flavor_notes || {})
      .map(([name, count]) => ({ name, count }))
      .slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <Header title="KALYBRATE" />

        <div className="mt-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Coffee Shop Dashboard</p>
          <h2 className="mt-2 text-2xl font-semibold">{dashboardData?.coffee_shop?.name || 'Unknown Coffee Shop'}</h2>
          <p className="mt-2 text-sm text-slate-300">
            Last session: {summary.last_session_date || '-'} | Generated: {dashboardData?.generated_at || '-'}
          </p>
        </div>

        <div className="py-6 sm:py-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Users', value: summary.total_users ?? 0 },
              { label: 'Beans', value: summary.total_beans ?? 0 },
              { label: 'Grinders', value: summary.total_grinders ?? 0 },
              { label: 'Sessions', value: summary.total_sessions ?? 0 },
              { label: 'Shots', value: summary.total_shots ?? 0 },
              { label: 'Active Days (30d)', value: summary.active_days_30d ?? 0 },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <p className="text-xs text-slate-500 uppercase">{item.label}</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Activity Trend (6 Months)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sessions" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="shots" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Top Flavor Categories</h3>
              <div className="h-80">
                {flavorCategoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={flavorCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110}>
                        {flavorCategoryData.map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500">No flavor data available</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Avg Dose', value: `${performance?.averages?.dose ?? 0} g` },
              { label: 'Avg Yield', value: `${performance?.averages?.yield ?? 0} g` },
              { label: 'Avg Time', value: `${performance?.averages?.time_seconds ?? 0} s` },
              { label: 'Avg Temp', value: `${performance?.averages?.water_temperature ?? 0} degC` },
              { label: 'Avg Brew Ratio', value: performance?.averages?.brew_ratio ?? 0 },
            ].map((metric) => (
              <div key={metric.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <p className="text-xs uppercase text-slate-500">{metric.label}</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Top Beans by Session</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={beanStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bean_name" interval={0} angle={-25} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="session_count" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Top Grinders by Usage</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={grinderStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grinder_name" interval={0} angle={-25} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="usage_count" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 overflow-x-auto">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Contributors</h3>
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Sessions</th>
                    <th className="px-6 py-3 text-left">Shots</th>
                    <th className="px-6 py-3 text-left">Last Session</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {contributors.length > 0 ? contributors.map((item) => (
                    <tr key={item.user_id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-4 font-medium text-slate-900">{item.name}</td>
                      <td className="px-4 py-4">{item.sessions}</td>
                      <td className="px-6 py-4">{item.shots}</td>
                      <td className="px-6 py-4">{item.last_session_date || '-'}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-6 text-center text-slate-500">No contributor data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Top Flavor Notes</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topNotes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#D97706" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Recent Calibration Sessions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Barista</th>
                    <th className="px-6 py-3 text-left">Bean</th>
                    <th className="px-6 py-3 text-left">Grinder</th>
                    <th className="px-6 py-3 text-left">Shots</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentSessions.length > 0 ? recentSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">{session.session_date || '-'}</td>
                      <td className="px-6 py-4">{session.user?.name || '-'}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{session.bean?.name || '-'}</td>
                      <td className="px-6 py-4">{session.grinder?.name || '-'}</td>
                      <td className="px-6 py-4">{session.shots_count ?? 0}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-6 text-center text-slate-500">No recent sessions</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
