import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backEndURL, currency } from '../App';
import { toast } from 'react-toastify';
import { Store, MapPin, Phone, CreditCard, Search, RefreshCw, UserX, UserCheck, Package, TrendingUp, Ban, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sellers = ({ token }) => {
    const { darkMode } = useTheme();
    const [sellers, setSellers] = useState([]);
    const [filteredSellers, setFilteredSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchSellers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(backEndURL + '/api/user/sellers', { headers: { token } });
            if (response.data.success) {
                setSellers(response.data.sellers);
                setFilteredSellers(response.data.sellers);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch sellers.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = sellers;
        if (searchQuery) {
            filtered = filtered.filter(s =>
                s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.sellerProfile?.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (statusFilter === 'active') filtered = filtered.filter(s => !s.isBanned);
        else if (statusFilter === 'banned') filtered = filtered.filter(s => s.isBanned);
        setFilteredSellers(filtered);
    }, [searchQuery, statusFilter, sellers]);

    useEffect(() => { if (token) fetchSellers(); }, [token]);

    const handleBan = async (userId, currentStatus, shopName) => {
        const isBanning = !currentStatus;
        let reason = "";
        if (isBanning) {
            reason = prompt(`Enter reason for banning "${shopName}":`);
            if (!reason) return;
        } else {
            if (!window.confirm(`Unban "${shopName}"?`)) return;
        }
        try {
            const response = await axios.post(backEndURL + '/api/user/ban', { userId, isBanned: isBanning, banReason: reason }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchSellers();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to update ban status.");
        }
    };

    const stats = {
        total: sellers.length,
        active: sellers.filter(s => !s.isBanned).length,
        banned: sellers.filter(s => s.isBanned).length
    };

    return (
        <div className="py-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        <Store className="text-blue-500" size={28} /> Seller Management
                    </h1>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Manage registered lenders</p>
                </div>
                <button onClick={fetchSellers} disabled={loading} className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-all ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white hover:shadow-md'}`}>
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total Sellers', value: stats.total, color: 'border-blue-500', icon: <Store size={18} /> },
                    { label: 'Active', value: stats.active, color: 'border-green-500', icon: <ShieldCheck size={18} className="text-green-500" /> },
                    { label: 'Banned', value: stats.banned, color: 'border-red-500', icon: <Ban size={18} className="text-red-500" /> }
                ].map(stat => (
                    <div key={stat.label} className={`p-4 rounded-xl shadow-sm border-l-4 ${stat.color} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center gap-2">
                            {stat.icon}
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                        </div>
                        <p className={`text-2xl font-bold ${stat.label === 'Banned' ? 'text-red-500' : stat.label === 'Active' ? 'text-green-500' : darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className={`p-4 rounded-xl shadow-sm mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or shop..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}>
                        <option value="all">All Sellers</option>
                        <option value="active">Active Only</option>
                        <option value="banned">Banned Only</option>
                    </select>
                </div>
                <p className={`text-sm mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Showing {filteredSellers.length} of {sellers.length} sellers</p>
            </div>

            {/* Sellers Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`rounded-xl p-6 animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className={`h-12 w-12 rounded-full mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            <div className={`h-6 rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            <div className={`h-4 rounded w-2/3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                        </div>
                    ))}
                </div>
            ) : filteredSellers.length === 0 ? (
                <div className={`text-center py-20 rounded-xl ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                    <Store size={64} className="mx-auto mb-4 opacity-20" />
                    <p className="text-xl">No sellers found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSellers.map((seller) => (
                        <div key={seller._id} className={`rounded-xl shadow-sm hover:shadow-md transition-all p-6 border-2 ${seller.isBanned ? 'border-red-300 dark:border-red-800' : 'border-transparent'} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                                    {seller.sellerProfile?.shopName?.charAt(0).toUpperCase() || 'S'}
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 ${seller.isBanned ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'}`}>
                                    {seller.isBanned ? <><UserX size={12} /> Banned</> : <><UserCheck size={12} /> Active</>}
                                </span>
                            </div>

                            <h4 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{seller.sellerProfile?.shopName || 'Unknown Shop'}</h4>
                            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{seller.name} • {seller.email}</p>

                            <div className={`space-y-3 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {seller.sellerProfile?.address?.street}, {seller.sellerProfile?.address?.city}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-gray-400" />
                                    <p className={`text-sm font-mono ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{seller.sellerProfile?.address?.phone}</p>
                                </div>
                            </div>

                            {seller.isBanned && (
                                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-lg">
                                    <strong>Reason:</strong> {seller.banReason}
                                </div>
                            )}

                            <button
                                onClick={() => handleBan(seller._id, seller.isBanned, seller.sellerProfile?.shopName)}
                                className={`w-full mt-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${seller.isBanned ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                            >
                                {seller.isBanned ? <><UserCheck size={16} /> Unban</> : <><UserX size={16} /> Ban Seller</>}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Sellers;
