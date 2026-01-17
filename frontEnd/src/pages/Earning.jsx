import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Earning = () => {
    const { backEndURL, token, currency } = useContext(ShopContext);
    const [earnings, setEarnings] = useState([]);
    const [summary, setSummary] = useState({
        totalEarnings: "0.00",
        pendingEarnings: "0.00",
        completedEarnings: "0.00",
        totalOrders: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadEarningData = async () => {
        try {
            if (!token) {
                setError('Please log in to view your earnings.');
                return;
            }

            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${backEndURL}/api/order/my_earning`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setEarnings(response.data.earnings || []);
                setSummary(response.data.summary || {
                    totalEarnings: "0.00",
                    pendingEarnings: "0.00",
                    completedEarnings: "0.00",
                    totalOrders: 0
                });
            } else {
                setError(response.data.message || 'Failed to fetch earnings.');
            }
        } catch (err) {
            console.error('Error fetching earnings:', err);
            setError('Error fetching earnings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEarningData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    if (loading) {
        return (
            <div className="border-t pt-24 bg-gray-50 flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                    <p className="text-lg text-gray-600 mt-4">Loading earnings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border-t pt-24 bg-gray-50 flex justify-center items-center h-screen">
                <div className="text-center">
                    <p className="text-lg text-red-600">{error}</p>
                    <button
                        onClick={loadEarningData}
                        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='border-t pt-20 bg-gray-50 min-h-screen'>
            <div className='text-2xl text-center font-semibold text-gray-800 mb-8'>
                <Title text1={'MY'} text2={'EARNINGS'} />
            </div>

            {/* Summary Cards */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Earnings */}
                    <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg">
                        <p className="text-sm font-medium opacity-80">Total Earnings</p>
                        <p className="text-3xl font-bold mt-2">{currency}{summary.totalEarnings}</p>
                        <p className="text-xs mt-2 opacity-70">After platform fees</p>
                    </div>

                    {/* Completed Earnings */}
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                        <p className="text-sm font-medium opacity-80">Completed</p>
                        <p className="text-3xl font-bold mt-2">{currency}{summary.completedEarnings}</p>
                        <p className="text-xs mt-2 opacity-70">From delivered orders</p>
                    </div>

                    {/* Pending Earnings */}
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
                        <p className="text-sm font-medium opacity-80">Pending</p>
                        <p className="text-3xl font-bold mt-2">{currency}{summary.pendingEarnings}</p>
                        <p className="text-xs mt-2 opacity-70">Orders in progress</p>
                    </div>

                    {/* Total Orders */}
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                        <p className="text-sm font-medium opacity-80">Total Orders</p>
                        <p className="text-3xl font-bold mt-2">{summary.totalOrders}</p>
                        <p className="text-xs mt-2 opacity-70">Products rented</p>
                    </div>
                </div>
            </div>

            {/* Earnings List */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Rental History</h2>
                    <button
                        onClick={loadEarningData}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                    >
                        Refresh
                    </button>
                </div>

                {earnings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-500 text-lg">No earnings yet!</p>
                        <p className="text-gray-400 mt-2">When other users rent your products, your earnings will appear here.</p>
                        <a
                            href="/lend"
                            className="inline-block mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                            List Your First Product
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {earnings.map((earning, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-start gap-4">
                                    {earning.productImage && (
                                        <img
                                            src={earning.productImage}
                                            alt={earning.productName}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{earning.productName}</h3>
                                        <p className="text-sm text-gray-500">Size: {earning.size}</p>
                                        <p className="text-sm text-gray-500">{earning.duration} days rental</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Gross Amount:</span>
                                        <span className="font-medium">{currency}{earning.grossAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-red-500">
                                        <span>Platform Fee (15%):</span>
                                        <span>-{currency}{earning.platformFee}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600 font-bold text-base pt-2 border-t">
                                        <span>Your Earning:</span>
                                        <span>{currency}{earning.netEarning}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-between items-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${earning.status === 'Delivered'
                                            ? 'bg-green-100 text-green-700'
                                            : earning.status === 'Order Placed'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {earning.status}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(earning.orderDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                    <h3 className="text-blue-800 font-semibold">How Earnings Work</h3>
                    <ul className="mt-2 text-sm text-blue-700 space-y-1">
                        <li>• When someone rents your product, you earn the rental price minus 15% platform fee</li>
                        <li>• Earnings show as "Pending" until the order is delivered</li>
                        <li>• Completed earnings are from successfully delivered orders</li>
                        <li>• Payouts are processed after the rental period ends</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Earning;
