import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backEndURL, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { Calendar, Clock, Zap, Package, Search, RefreshCw, Filter, ChevronDown, ChevronUp, MapPin, Phone, User, Truck, Moon, Sun } from 'lucide-react';

const CountdownTimer = ({ returnDateTime }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const returnDateTimeInMs = new Date(returnDateTime).getTime();
      const difference = returnDateTimeInMs - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft(null);
      }
    };

    const timer = setInterval(calculateTimeLeft, 60000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, [returnDateTime]);

  if (!timeLeft) {
    return <span className="text-red-500 font-bold text-xs">Overdue!</span>;
  }

  return (
    <span className="text-orange-600 dark:text-orange-400 font-mono text-xs">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
    </span>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('adminDarkMode') === 'true');

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('adminDarkMode', darkMode);
  }, [darkMode]);

  const calculateExpirationDate = (orderDate, rentalDays) => {
    const orderDateObj = new Date(orderDate);
    orderDateObj.setDate(orderDateObj.getDate() + rentalDays);
    return orderDateObj;
  };

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.post(backEndURL + '/api/order/list', {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
        setFilteredOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address?.phone?.includes(searchQuery)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backEndURL + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Status updated!");
      }
    } catch (error) {
      toast.error('Error updating status.');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const getStatusColor = (status) => {
    const colors = {
      'Order Placed': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'Packing': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'Shipped': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
      'Out for delivery': 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
      'Delivered': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Order Placed').length,
    shipped: orders.filter(o => ['Shipped', 'Out for delivery'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    urgent: orders.filter(o => o.urgentOrder).length
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Order Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Track and manage all rental orders</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all"
              title="Toggle theme"
            >
              {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-600" />}
            </button>
            <button
              onClick={fetchAllOrders}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all text-gray-700 dark:text-gray-200"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Mobile Scrollable */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-5">
          {[
            { label: 'Total', value: stats.total, color: 'border-blue-500', icon: <Package size={18} /> },
            { label: 'Pending', value: stats.pending, color: 'border-yellow-500', icon: <Clock size={18} /> },
            { label: 'In Transit', value: stats.shipped, color: 'border-purple-500', icon: <Truck size={18} /> },
            { label: 'Delivered', value: stats.delivered, color: 'border-green-500', icon: <Package size={18} /> },
            { label: 'Urgent', value: stats.urgent, color: 'border-orange-500', icon: <Zap size={18} /> },
          ].map((stat) => (
            <div key={stat.label} className={`flex-shrink-0 min-w-[120px] bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 ${stat.color}`}>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-1">
                {stat.icon}
                <span>{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
              <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                {/* Order Header - Always Visible */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                        {order.address?.fullName?.charAt(0) || 'O'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800 dark:text-white">{order.address?.fullName || 'N/A'}</span>
                          {order.urgentOrder && (
                            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                              <Zap size={10} /> Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">#{order._id.slice(-8)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">{currency}{order.amount}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      {expandedOrder === order._id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order._id && (
                  <div className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-850">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                      {/* Customer Info */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 flex items-center gap-1">
                          <User size={14} /> Customer
                        </h4>
                        <p className="font-medium text-gray-800 dark:text-white">{order.address?.fullName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 mt-1">
                          <Phone size={12} /> {order.address?.phone}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-1 mt-1">
                          <MapPin size={12} className="mt-0.5 shrink-0" />
                          {order.address?.hostel}, Block {order.address?.block}, Room {order.address?.room}
                        </p>
                      </div>

                      {/* Rental Dates */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 flex items-center gap-1">
                          <Calendar size={14} /> Rental Period
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Start:</span>
                            <span className="font-medium text-gray-800 dark:text-white">{formatDate(order.rentalStartDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">End:</span>
                            <span className="font-medium text-gray-800 dark:text-white">{formatDate(order.rentalEndDate)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t dark:border-gray-700">
                            <span className="text-gray-500 dark:text-gray-400">Delivery:</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">{formatDate(order.deliveryDate)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 flex items-center gap-1">
                          <Package size={14} /> Items ({order.items?.length})
                        </h4>
                        <div className="space-y-2 max-h-28 overflow-y-auto">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 rounded-full bg-red-400"></div>
                              <span className="text-gray-800 dark:text-white truncate">{item.name}</span>
                              <span className="text-gray-500 dark:text-gray-400">({item.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Update Status */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 flex items-center gap-1">
                          <Truck size={14} /> Update Status
                        </h4>
                        <select
                          onChange={(e) => statusHandler(e, order._id)}
                          value={order.status}
                          className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-red-500"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Packing">Packing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for delivery">Out for delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>

                        {order.status === 'Delivered' && (
                          <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/30 rounded text-xs">
                            <span className="text-orange-600 dark:text-orange-400">Return in: </span>
                            <CountdownTimer returnDateTime={calculateExpirationDate(order.date, order.items?.[0]?.duration || 3)} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing Breakdown */}
                    {order.pricingBreakdown && (
                      <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Pricing Breakdown</h4>
                        <div className="flex flex-wrap gap-4 text-sm">
                          {order.pricingBreakdown.map((item, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                              <span className="text-gray-600 dark:text-gray-300">{item.productName}:</span>
                              <span className="font-semibold text-gray-800 dark:text-white ml-2">{currency}{item.total}</span>
                              <span className="text-gray-400 dark:text-gray-500 ml-1">({item.days} days)</span>
                            </div>
                          ))}
                          {order.urgentFee > 0 && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/30 px-3 py-2 rounded">
                              <span className="text-yellow-600 dark:text-yellow-400">Urgent Fee:</span>
                              <span className="font-semibold text-yellow-700 dark:text-yellow-300 ml-2">{currency}{order.urgentFee}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
