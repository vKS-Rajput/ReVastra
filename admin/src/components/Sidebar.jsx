import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PackagePlus, List, ShoppingBag, Users, Box, ClipboardList } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { backEndURL } from '../App';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(backEndURL + '/api/user/admin/stats', {
          headers: {token},
        });
        if (data.success) {
          setStats({
            users: data.userCount,
            products: data.productCount,
            orders: data.orderCount,
          });
        } else {
          toast.error(data.message || 'Failed to fetch stats');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Error fetching stats');
      }
    };

    fetchStats();
  }, []);

  const navItems = [
    { to: '/add', label: 'Add Items', icon: <PackagePlus size={32} /> },
    { to: '/list', label: 'List Items', icon: <List size={32} /> },
    { to: '/orders', label: 'Orders', icon: <ShoppingBag size={32} /> },
  ];

  const statCards = [
    { label: 'Registered Users', count: stats.users, icon: <Users size={36} />, color: 'bg-blue-500' },
    { label: 'Products Listed', count: stats.products, icon: <Box size={36} />, color: 'bg-green-500' },
    { label: 'Orders Placed', count: stats.orders, icon: <ClipboardList size={36} />, color: 'bg-yellow-500' },
  ];

  return (
    <div className="from-blue-50 to-blue-100 py-10 px-4">
      <ToastContainer />

      {/* Dashboard Header */}
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Admin Dashboard</h2>

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {statCards.map(({ label, count, icon, color }) => (
          <div
            key={label}
            className={`flex items-center justify-between p-6 rounded-3xl shadow-lg ${color} text-white transform transition-transform duration-300 hover:scale-105`}
          >
            <div className="flex flex-col">
              <span className="text-xl font-medium">{label}</span>
              <span className="text-3xl font-bold mt-2">{count}</span>
            </div>
            <div className="bg-white text-black rounded-full p-3">{icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
