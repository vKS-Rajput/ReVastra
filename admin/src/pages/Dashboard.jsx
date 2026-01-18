import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PackagePlus, List, ShoppingBag, Users, Box, ClipboardList, TrendingUp, RefreshCw, Store } from 'lucide-react';
import axios from 'axios';
import { backEndURL } from '../App';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real statistics from backend
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const response = await axios.get(`${backEndURL}/api/stats`, {
        headers: { token }
      });

      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        setError('Failed to load statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const navItems = [
    { to: '/add', label: 'Add Items', icon: <PackagePlus size={32} /> },
    { to: '/list', label: 'List Items', icon: <List size={32} /> },
    { to: '/orders', label: 'Orders', icon: <ShoppingBag size={32} /> },
    { to: '/sellers', label: 'Sellers', icon: <Store size={32} /> },
  ];

  const statCards = [
    { label: 'Registered Users', count: stats.users, icon: <Users size={36} />, color: 'bg-blue-500' },
    { label: 'Products Listed', count: stats.products, icon: <Box size={36} />, color: 'bg-green-500' },
    { label: 'Total Orders', count: stats.orders, icon: <ClipboardList size={36} />, color: 'bg-yellow-500' },
    { label: 'Delivered Orders', count: stats.deliveredOrders, icon: <ShoppingBag size={36} />, color: 'bg-emerald-500' },
    { label: 'Pending Orders', count: stats.pendingOrders, icon: <ClipboardList size={36} />, color: 'bg-orange-500' },
    { label: 'Total Revenue', count: `₹${stats.totalRevenue?.toLocaleString() || 0}`, icon: <TrendingUp size={36} />, color: 'bg-purple-500' },
  ];

  return (
    <div className="from-blue-50 to-blue-100 py-10 px-4">
      {/* Dashboard Header */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <h2 className="text-4xl font-bold text-center text-gray-800">Admin Dashboard</h2>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
          title="Refresh stats"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={label}
            to={to}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-2xl hover:bg-[#E63946] hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            {icon}
            <span className="mt-4 text-lg font-semibold">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Statistics Section */}
      <h3 className="text-3xl font-semibold text-center text-gray-700 mb-8">Platform Statistics</h3>

      {error && (
        <div className="text-center text-red-500 mb-4">
          {error}
          <button onClick={fetchStats} className="ml-2 underline">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {statCards.map(({ label, count, icon, color }) => (
          <div
            key={label}
            className={`flex items-center justify-between p-6 rounded-3xl shadow-lg ${color} text-white transform transition-transform duration-300 hover:scale-105`}
          >
            <div className="flex flex-col">
              <span className="text-xl font-medium">{label}</span>
              {loading ? (
                <div className="h-9 w-20 bg-white/30 animate-pulse rounded mt-2"></div>
              ) : (
                <span className="text-3xl font-bold mt-2">{count}</span>
              )}
            </div>
            <div className="bg-white text-black rounded-full p-3">
              {icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

