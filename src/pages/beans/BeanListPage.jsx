import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { beanAPI } from '../../services/api';
import BeanCard from '../../components/beans/BeanCard';
import BeanFormModal from '../../components/beans/BeanFormModal';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/common/Header';

const BeanListPage = () => {
  const [beans, setBeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingBean, setEditingBean] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
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

    const fetchBeans = async () => {
      try {
        setLoading(true);
        const response = await beanAPI.getAllBeans();
        setBeans(response.data.data || response.data); // Handle different response structures
      } catch (err) {
        setError(err.message || 'Failed to load beans');
        console.error('Error fetching beans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBeans();
  }, [isAuthenticated, checkingAuthStatus]);

  const handleAddBean = () => {
    setEditingBean(null);
    setShowFormModal(true);
  };

  const handleEditBean = (bean) => {
    setEditingBean(bean);
    setShowFormModal(true);
  };

  const handleDeleteBean = async (beanId) => {
    if (!window.confirm('Are you sure you want to delete this bean?')) {
      return;
    }

    try {
      await beanAPI.deleteBean(beanId);
      setBeans(beans.filter(bean => bean.id !== beanId));
    } catch (err) {
      setError(err.message || 'Failed to delete bean');
      console.error('Error deleting bean:', err);
    }
  };

  const handleFormSubmit = async (beanData) => {
    try {
      if (editingBean) {
        // Update existing bean
        const response = await beanAPI.updateBean(editingBean.id, beanData);
        const updatedBean = response.data.data || response.data;
        setBeans(beans.map(bean =>
          bean.id === editingBean.id ? { ...updatedBean, id: editingBean.id } : bean
        ));
      } else {
        // Create new bean
        const response = await beanAPI.createBean(beanData);
        const newBean = response.data.data || response.data;
        setBeans([...beans, newBean]);
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to save bean');
    }
  };

  // Filter beans based on search term
  const filteredBeans = beans.filter(bean => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      bean.name.toLowerCase().includes(searchTermLower) ||
      (bean.roastery && bean.roastery.toLowerCase().includes(searchTermLower)) ||
      (bean.origin && bean.origin.toLowerCase().includes(searchTermLower)) ||
      (bean.notes && bean.notes.toLowerCase().includes(searchTermLower))
    );
  });

  // Filter beans based on active tab
  const filteredBeansByTab = filteredBeans.filter(bean => {
    if (activeTab === 'all') {
      return true; // Show all beans
    } else if (activeTab === 'single-origin') {
      return !bean.is_blend; // Show only single origin beans (where is_blend is false)
    } else if (activeTab === 'blend') {
      return bean.is_blend; // Show only blend beans (where is_blend is true)
    }
    return true;
  });

  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* KEEPING YOUR HEADER */}
        <Header title="Espresso Calibrator" />

        <div className="mt-10">

          {/* PAGE TITLE + ACTION */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Bean Management
              </h1>
              <p className="text-gray-500 mt-2">
                Manage your coffee bean inventory and properties
              </p>
            </div>

            <button
              onClick={handleAddBean}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              + Add Bean
            </button>
          </div>

          {/* SEARCH + STATS CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <input
                  type="text"
                  placeholder="Search beans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Total Count */}
              <div className="text-sm text-gray-500">
                Total Beans:
                <span className="ml-2 text-lg font-semibold text-gray-900">
                  {filteredBeans.length}
                </span>
              </div>
            </div>

            {/* TABS */}
            <div className="mt-6 border-b border-gray-200">
              <div className="flex space-x-8">
                {['all', 'single-origin', 'blend'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium border-b-2 transition ${activeTab === tab
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {tab === 'all'
                      ? 'All Beans'
                      : tab === 'single-origin'
                        ? 'Single Origin'
                        : 'Blend'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredBeansByTab.length === 0 ? (

            /* EMPTY STATE */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 py-20 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                No beans found
              </h3>
              <p className="text-gray-500 mt-2">
                Add your first bean to start tracking calibration sessions.
              </p>

              <button
                onClick={handleAddBean}
                className="mt-6 inline-flex px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Add Bean
              </button>
            </div>

          ) : (

            /* TABLE CARD */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4 text-left">Bean</th>
                      <th className="px-6 py-4 text-left">Origin</th>
                      <th className="px-6 py-4 text-left">Roast</th>
                      <th className="px-6 py-4 text-left">Type</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {filteredBeansByTab.map((bean) => (
                      <tr
                        key={bean.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-5">
                          <div
                            onClick={() =>
                              navigate(`/beans/${bean.id}/sessions`)
                            }
                            className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer"
                          >
                            {bean.name || bean.bean_name || 'Unnamed Bean'}
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            {bean.roastery || 'Roastery Unknown'}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          {bean.origin || 'Unknown'}
                        </td>

                        <td className="px-6 py-5">
                          {bean.roast_level || 'Unknown'}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${bean.is_blend
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-green-100 text-green-700'
                              }`}
                          >
                            {bean.is_blend ? 'Blend' : 'Single Origin'}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleEditBean(bean)}
                              className="text-gray-500 hover:text-indigo-600 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBean(bean.id)}
                              className="text-gray-500 hover:text-red-600 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          )}

          {/* MODAL */}
          <BeanFormModal
            isOpen={showFormModal}
            onClose={() => setShowFormModal(false)}
            bean={editingBean}
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default BeanListPage;