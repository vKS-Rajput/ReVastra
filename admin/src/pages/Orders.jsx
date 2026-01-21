import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backEndURL, currency } from '../App';
import { toast } from 'react-toastify';
import { Calendar, Clock, Zap, Package, Search, RefreshCw, ChevronDown, ChevronUp, MapPin, Phone, User, Truck, Download, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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

  if (!timeLeft) return <span className="text-red-500 font-bold text-xs">Overdue!</span>;
  return <span className="text-orange-500 font-mono text-xs">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>;
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const Orders = ({ token }) => {
  const { darkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

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

  useEffect(() => {
    let filtered = orders;
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address?.phone?.includes(searchQuery)
      );
    }
    if (statusFilter !== 'all') filtered = filtered.filter(order => order.status === statusFilter);
    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backEndURL + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Status updated!");
      }
    } catch (error) {
      toast.error('Error updating status.');
    }
  };

  useEffect(() => { fetchAllOrders(); }, [token]);

  const getStatusColor = (status) => {
    const colors = {
      'Order Placed': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      'Packing': 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
      'Shipped': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
      'Out for delivery': 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      'Delivered': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  // Export orders to CSV
  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer', 'Phone', 'Amount', 'Status', 'Date', 'Urgent'];
    const rows = filteredOrders.map(o => [
      o._id,
      o.address?.fullName || 'N/A',
      o.address?.phone || 'N/A',
      o.amount,
      o.status,
      formatDate(o.date),
      o.urgentOrder ? 'Yes' : 'No'
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Orders exported to CSV!');
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Order Placed').length,
    shipped: orders.filter(o => ['Shipped', 'Out for delivery'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    urgent: orders.filter(o => o.urgentOrder).length
  };

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Order Management</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Track and manage all rental orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportToCSV} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${darkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}>
            <Download size={18} /> Export
          </button>
          <button onClick={fetchAllOrders} disabled={loading} className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-all ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white hover:shadow-md'}`}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-5">
        {[
          { label: 'Total', value: stats.total, color: 'border-blue-500', icon: <Package size={18} /> },
          { label: 'Pending', value: stats.pending, color: 'border-yellow-500', icon: <Clock size={18} /> },
          { label: 'In Transit', value: stats.shipped, color: 'border-purple-500', icon: <Truck size={18} /> },
          { label: 'Delivered', value: stats.delivered, color: 'border-green-500', icon: <Package size={18} /> },
          { label: 'Urgent', value: stats.urgent, color: 'border-orange-500', icon: <Zap size={18} /> },
        ].map((stat) => (
          <div key={stat.label} className={`flex-shrink-0 min-w-[120px] p-4 rounded-xl shadow-sm border-l-4 ${stat.color} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`flex items-center gap-2 text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {stat.icon}
              <span>{stat.label}</span>
            </div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl shadow-sm mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, name, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`px-4 py-2.5 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}>
            <option value="all">All Status</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Showing {filteredOrders.length} of {orders.length} orders</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className={`rounded-xl p-6 animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`h-6 rounded w-1/3 mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          ))
        ) : filteredOrders.length === 0 ? (
          <div className={`rounded-xl p-12 text-center ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400'}`}>
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className={`rounded-xl shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Order Header */}
              <div className={`p-4 cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`} onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                      {order.address?.fullName?.charAt(0) || 'O'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{order.address?.fullName || 'N/A'}</span>
                        {order.urgentOrder && (
                          <span className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <Zap size={10} /> Urgent
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>#{order._id.slice(-8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{currency}{order.amount}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status}</span>
                    {expandedOrder === order._id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div className={`border-t p-4 ${darkMode ? 'border-gray-700 bg-gray-850' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Customer */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h4 className={`text-xs font-semibold uppercase mb-3 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <User size={14} /> Customer
                      </h4>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{order.address?.fullName}</p>
                      <p className={`text-sm flex items-center gap-1 mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Phone size={12} /> {order.address?.phone}
                      </p>
                      <p className={`text-sm flex items-start gap-1 mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <MapPin size={12} className="mt-0.5 shrink-0" /> {order.address?.hostel}, {order.address?.block}, Room {order.address?.room}
                      </p>
                    </div>

                    {/* Rental Dates */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h4 className={`text-xs font-semibold uppercase mb-3 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Calendar size={14} /> Rental Period
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Start:</span>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatDate(order.rentalStartDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>End:</span>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatDate(order.rentalEndDate)}</span>
                        </div>
                        <div className={`flex justify-between pt-2 border-t ${darkMode ? 'border-gray-700' : ''}`}>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Delivery:</span>
                          <span className="font-medium text-blue-500">{formatDate(order.deliveryDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h4 className={`text-xs font-semibold uppercase mb-3 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Package size={14} /> Items ({order.items?.length})
                      </h4>
                      <div className="space-y-2 max-h-28 overflow-y-auto">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                            <span className={`truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>({item.size})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Update Status */}
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h4 className={`text-xs font-semibold uppercase mb-3 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Truck size={14} /> Update Status
                      </h4>
                      <select
                        onChange={(e) => statusHandler(e, order._id)}
                        value={order.status}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      {order.status === 'Delivered' && (
                        <div className={`mt-3 p-2 rounded text-xs ${darkMode ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
                          <span className="text-orange-500">Return in: </span>
                          <CountdownTimer returnDateTime={calculateExpirationDate(order.date, order.items?.[0]?.duration || 3)} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
