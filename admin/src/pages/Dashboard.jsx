import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PackagePlus, List, ShoppingBag, Users, Box, ClipboardList, TrendingUp, RefreshCw, Store, Calendar, AlertTriangle, CheckCircle, Clock, DollarSign, Package } from 'lucide-react';
import axios from 'axios';
import { backEndURL, currency } from '../App';

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics and recent orders
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, ordersRes] = await Promise.all([
        axios.get(`${backEndURL}/api/stats`, { headers: { token } }),
        axios.post(`${backEndURL}/api/order/list`, {}, { headers: { token } })
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      if (ordersRes.data.success) {
        // Get last 5 orders
        setRecentOrders(ordersRes.data.orders.slice(0, 5));
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
  }, [token]);

  const navItems = [
    { to: '/add', label: 'Add Product', icon: <PackagePlus size={28} />, desc: 'List new items' },
    { to: '/list', label: 'Products', icon: <List size={28} />, desc: 'Manage inventory' },
    { to: '/orders', label: 'Orders', icon: <ShoppingBag size={28} />, desc: 'Track rentals' },
    { to: '/sellers', label: 'Sellers', icon: <Store size={28} />, desc: 'Manage lenders' },
  ];

  const statCards = [
    { label: 'Total Users', count: stats.users, icon: <Users size={32} />, color: 'from-blue-500 to-blue-600', trend: '+12%' },
    { label: 'Products', count: stats.products, icon: <Box size={32} />, color: 'from-emerald-500 to-emerald-600', trend: '+8%' },
    { label: 'Total Orders', count: stats.orders, icon: <ClipboardList size={32} />, color: 'from-amber-500 to-amber-600', trend: '+24%' },
    { label: 'Delivered', count: stats.deliveredOrders, icon: <CheckCircle size={32} />, color: 'from-green-500 to-green-600', trend: '' },
    { label: 'Pending', count: stats.pendingOrders, icon: <Clock size={32} />, color: 'from-orange-500 to-orange-600', trend: '' },
    { label: 'Revenue', count: `${currency}${stats.totalRevenue?.toLocaleString() || 0}`, icon: <TrendingUp size={32} />, color: 'from-purple-500 to-purple-600', trend: '+18%' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Order Placed': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Out for delivery': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertTriangle size={20} />
          {error}
          <button onClick={fetchStats} className="ml-auto underline">Retry</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ label, count, icon, color, trend }) => (
          <div
            key={label}
            className={`relative overflow-hidden bg-gradient-to-br ${color} text-white rounded-2xl p-5 shadow-lg transform transition-all hover:scale-105`}
          >
            <div className="flex flex-col">
              <span className="text-white/80 text-sm font-medium">{label}</span>
              {loading ? (
                <div className="h-8 w-16 bg-white/30 animate-pulse rounded mt-1"></div>
              ) : (
                <span className="text-2xl font-bold mt-1">{count}</span>
              )}
              {trend && <span className="text-xs text-white/70 mt-1">{trend} this month</span>}
            </div>
            <div className="absolute -right-2 -bottom-2 opacity-20">
              {React.cloneElement(icon, { size: 64 })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {navItems.map(({ to, label, icon, desc }) => (
              <NavLink
                key={label}
                to={to}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">{label}</span>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Recent Orders</h3>
            <NavLink to="/orders" className="text-red-500 hover:text-red-600 text-sm font-medium">View All →</NavLink>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Order</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="border-b">
                      <td colSpan="5" className="py-4 px-4">
                        <div className="h-6 bg-gray-100 animate-pulse rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400">
                      <Package size={40} className="mx-auto mb-2 opacity-50" />
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-gray-600">#{order._id?.slice(-6)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-800">{order.address?.fullName || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800">{currency}{order.amount}</span>
                        {order.urgentOrder && <span className="ml-1 text-xs text-yellow-600">⚡</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Platform Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
          <h4 className="font-bold text-lg mb-2">Rental Platform</h4>
          <p className="text-blue-100 text-sm">Premium fashion rental service for college campuses. Quality verified items with secure deposits.</p>
        </div>
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl p-6">
          <h4 className="font-bold text-lg mb-2">Tiered Pricing</h4>
          <p className="text-emerald-100 text-sm">Day 1: Base | Days 2-3: +30% | Days 4-7: +50% | Day 8+: +72% of base price.</p>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6">
          <h4 className="font-bold text-lg mb-2">Security Deposit</h4>
          <p className="text-purple-100 text-sm">40% of product value held during rental. Fully refundable after successful return.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
