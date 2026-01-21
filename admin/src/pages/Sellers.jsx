import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backEndURL, currency } from '../App';
import { toast } from 'react-toastify';
import { Store, MapPin, Phone, CreditCard, Search, RefreshCw, UserX, UserCheck, Package, TrendingUp, Ban, ShieldCheck } from 'lucide-react';

const Sellers = ({ token }) => {
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
            console.error(error);
            toast.error('Failed to fetch sellers.');
        } finally {
            setLoading(false);
        }
    };

    // Apply filters
    useEffect(() => {
        let filtered = sellers;

        if (searchQuery) {
            filtered = filtered.filter(s =>
                s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.sellerProfile?.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter === 'active') {
            filtered = filtered.filter(s => !s.isBanned);
        } else if (statusFilter === 'banned') {
            filtered = filtered.filter(s => s.isBanned);
        }

        setFilteredSellers(filtered);
    }, [searchQuery, statusFilter, sellers]);

    useEffect(() => {
        if (token) {
            fetchSellers();
        }
    }, [token]);

    const handleBan = async (userId, currentStatus, shopName) => {
        const isBanning = !currentStatus;
        let reason = "";

        if (isBanning) {
            reason = prompt(`Enter reason for banning "${shopName}":`);
            if (!reason) return;
        } else {
            if (!window.confirm(`Are you sure you want to unban "${shopName}"?`)) return;
        }

        try {
            const response = await axios.post(
                backEndURL + '/api/user/ban',
                { userId, isBanned: isBanning, banReason: reason },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                fetchSellers();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update ban status.");
        }
    };

    // Stats
    const stats = {
        total: sellers.length,
        active: sellers.filter(s => !s.isBanned).length,
        banned: sellers.filter(s => s.isBanned).length
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Store className="text-blue-600" size={28} /> Seller Management
                    </h1>
                    <p className="text-gray-500">Manage registered lenders and their profiles</p>
                </div>
                <button
                    onClick={fetchSellers}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm">Total Sellers</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-green-500" />
                        <p className="text-gray-500 text-sm">Active</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
                    <div className="flex items-center gap-2">
                        <Ban size={18} className="text-red-500" />
                        <p className="text-gray-500 text-sm">Banned</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{stats.banned}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or shop..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Sellers</option>
                        <option value="active">Active Only</option>
                        <option value="banned">Banned Only</option>
                    </select>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                    Showing {filteredSellers.length} of {sellers.length} sellers
                </p>
            </div>

            {/* Sellers Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            ) : filteredSellers.length === 0 ? (
                <div className="text-center text-gray-500 py-20 bg-white rounded-xl">
                    <Store size={64} className="mx-auto mb-4 opacity-20" />
                    <p className="text-xl">No sellers found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSellers.map((seller) => (
                        <div
                            key={seller._id}
                            className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border-2 ${seller.isBanned ? 'border-red-300 bg-red-50' : 'border-transparent'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                                    {seller.sellerProfile?.shopName?.charAt(0).toUpperCase() || 'S'}
                                </div>
                                <div className="flex gap-2">
                                    {seller.isBanned ? (
                                        <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                            <UserX size={12} /> Banned
                                        </span>
                                    ) : (
                                        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                            <UserCheck size={12} /> Active
                                        </span>
                                    )}
                                </div>
                            </div>

                            <h4 className="text-xl font-bold text-gray-900 mb-1">
                                {seller.sellerProfile?.shopName || 'Unknown Shop'}
                            </h4>
                            <p className="text-sm text-gray-500 mb-4">{seller.name} • {seller.email}</p>

                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                    <p className="text-sm text-gray-600">
                                        {seller.sellerProfile?.address?.street}, {seller.sellerProfile?.address?.city}, {seller.sellerProfile?.address?.state}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-gray-400" />
                                    <p className="text-sm text-gray-600 font-mono">{seller.sellerProfile?.address?.phone}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CreditCard size={16} className="text-gray-400" />
                                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded flex-1">
                                        <p>UPI: {seller.sellerProfile?.bankingInfo?.upiId || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {seller.isBanned && (
                                <div className="mt-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
                                    <strong>Ban Reason:</strong> {seller.banReason}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <Package size={18} className="mx-auto text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-500">Products</p>
                                    <p className="font-bold text-gray-800">--</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <TrendingUp size={18} className="mx-auto text-green-500 mb-1" />
                                    <p className="text-xs text-gray-500">Earnings</p>
                                    <p className="font-bold text-green-600">--</p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleBan(seller._id, seller.isBanned, seller.sellerProfile?.shopName)}
                                className={`w-full mt-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${seller.isBanned
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                    }`}
                            >
                                {seller.isBanned ? (
                                    <><UserCheck size={16} /> Unban Seller</>
                                ) : (
                                    <><UserX size={16} /> Ban Seller</>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Sellers;
