import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { dashboardAPI } from '../../services/dashboardAPI';
import Header from '../../components/common/Header';

const Dashboard = () => {
  const [extractionTrends, setExtractionTrends] = useState(null);
  const [comparativeAnalysis, setComparativeAnalysis] = useState(null);
  const [optimalParameters, setOptimalParameters] = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisualizationData = async () => {
      try {
        setLoading(true);

        // Fetch all visualization data in parallel
        const [
          extractionTrendsData,
          comparativeAnalysisData,
          optimalParametersData,
          summaryStatsData
        ] = await Promise.all([
          dashboardAPI.getExtractionTrends(),
          dashboardAPI.getComparativeAnalysis(),
          dashboardAPI.getOptimalParameters(),
          dashboardAPI.getSummaryStats()
        ]);

        setExtractionTrends(extractionTrendsData);
        setComparativeAnalysis(comparativeAnalysisData);
        setOptimalParameters(optimalParametersData);
        setSummaryStats(summaryStatsData);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch visualization data');
        setLoading(false);
        console.error('Error fetching visualization data:', err);
      }
    };

    fetchVisualizationData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="max-w-7xl mx-auto p-4">
          <Header title="Espresso Calibrator Dashboard" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading visualization data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="max-w-7xl mx-auto p-4">
          <Header title="Espresso Calibrator Dashboard" />
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

  // Prepare extraction trends data for chart
  const extractionTrendsData = extractionTrends?.data || [];

  // Group extraction trends by bean name for comparison
  const extractionByBean = extractionTrendsData.reduce((acc, shot) => {
    const beanName = shot.bean_name;
    const existing = acc.find(item => item.bean_name === beanName);

    if (!existing) {
      acc.push({
        bean_name: beanName,
        avg_extraction_yield: 0,
        avg_extraction_ratio: 0,
        avg_flow_rate: 0,
        avg_time_seconds: 0,
        avg_grind_setting: 0,
        shot_count: 0
      });
    }

    const index = acc.findIndex(item => item.bean_name === beanName);
    acc[index].avg_extraction_yield += shot.extraction_yield;
    acc[index].avg_extraction_ratio += shot.extraction_ratio;
    acc[index].avg_flow_rate += shot.flow_rate;
    acc[index].avg_time_seconds += shot.time_seconds;
    acc[index].avg_grind_setting += parseFloat(shot.grind_setting);
    acc[index].shot_count += 1;

    return acc;
  }, []);

  // Calculate averages
  extractionByBean.forEach(bean => {
    bean.avg_extraction_yield = parseFloat((bean.avg_extraction_yield / bean.shot_count).toFixed(2));
    bean.avg_extraction_ratio = parseFloat((bean.avg_extraction_ratio / bean.shot_count).toFixed(2));
    bean.avg_flow_rate = parseFloat((bean.avg_flow_rate / bean.shot_count).toFixed(2));
    bean.avg_time_seconds = parseFloat((bean.avg_time_seconds / bean.shot_count).toFixed(2));
    bean.avg_grind_setting = parseFloat((bean.avg_grind_setting / bean.shot_count).toFixed(2));
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="max-w-7xl mx-auto p-4">
        <Header title="Espresso Calibrator Dashboard" />

        <main className="mt-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Shots</h3>
              <p className="text-3xl font-bold text-amber-600">{summaryStats?.total_shots || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Optimal Shots</h3>
              <p className="text-3xl font-bold text-amber-600">{summaryStats?.optimal_shots || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Optimal %</h3>
              <p className="text-3xl font-bold text-amber-600">{summaryStats?.optimal_percentage || 0}%</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Avg Yield</h3>
              <p className="text-3xl font-bold text-amber-600">{summaryStats?.avg_extraction_yield || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Avg Ratio</h3>
              <p className="text-3xl font-bold text-amber-600">{summaryStats?.avg_extraction_ratio || 0}</p>
            </div>
          </div>

          {/* Recommendations */}
          {optimalParameters?.recommendations && optimalParameters.recommendations.length > 0 && (
            <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Recommendations:</strong>
                    {optimalParameters.recommendations.map((rec, index) => (
                      <span key={index}> {rec.message}</span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Extraction Yield Trends */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Extraction Yield Trends</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={extractionTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="time_seconds" name="Time" label={{ value: 'Time (seconds)', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis type="number" dataKey="extraction_yield" name="Yield" label={{ value: 'Extraction Yield', angle: -90, position: 'insideLeft' }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Shots" dataKey="extraction_yield" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Extraction Ratio vs Grind Setting */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Extraction Ratio vs Grind Setting</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={extractionTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="grind_setting" name="Grind" label={{ value: 'Grind Setting', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis type="number" dataKey="extraction_ratio" name="Ratio" label={{ value: 'Extraction Ratio', angle: -90, position: 'insideLeft' }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Shots" dataKey="extraction_ratio" fill="#82ca9d" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bean Performance Comparison */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Bean Performance Comparison</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={extractionByBean}
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
                    <Bar dataKey="avg_extraction_yield" name="Avg. Extraction Yield" fill="#8884d8" />
                    <Bar dataKey="avg_extraction_ratio" name="Avg. Extraction Ratio" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comparative Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Session Comparative Analysis</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparativeAnalysis?.data || []}
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
                    <Bar dataKey="avg_extraction_yield" name="Avg. Extraction Yield" fill="#ff7300" />
                    <Bar dataKey="avg_extraction_ratio" name="Avg. Extraction Ratio" fill="#00c49f" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Extraction Trends Table */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Extraction Trends</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bean</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grind</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ratio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flow Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {extractionTrendsData.slice(0, 10).map((shot, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shot.session_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {shot.bean_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shot.grind_setting}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shot.time_seconds}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shot.extraction_yield}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shot.extraction_ratio}:1
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shot.flow_rate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;