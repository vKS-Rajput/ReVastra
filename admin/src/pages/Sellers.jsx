import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backEndURL } from '../App';
import { toast } from 'react-toastify';
import { Store, MapPin, Phone, CreditCard } from 'lucide-react';

const Sellers = ({ token }) => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSellers = async () => {
        try {
            const response = await axios.get(backEndURL + '/api/user/sellers', { headers: { token } });
            if (response.data.success) {
                setSellers(response.data.sellers);
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

    useEffect(() => {
        if (token) {
            fetchSellers();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleBan = async (userId, currentStatus) => {
        const isBanning = !currentStatus;
        let reason = "";

        if (isBanning) {
            reason = prompt("Enter reason for banning this seller:");
            if (!reason) return; // Cancel if no reason
        } else {
            if (!window.confirm("Are you sure you want to unban this seller?")) return;
        }

        try {
            const response = await axios.post(
                backEndURL + '/api/user/ban',
                { userId, isBanned: isBanning, banReason: reason },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                fetchSellers(); // Refresh list
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update ban status.");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Store className="text-blue-600" size={32} /> Registered Sellers
            </h3>

            {sellers.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                    <Store size={64} className="mx-auto mb-4 opacity-20" />
                    <p className="text-xl">No sellers registered yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sellers.map((seller) => (
                        <div key={seller._id} className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border ${seller.isBanned ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                                    {seller.sellerProfile?.shopName?.charAt(0).toUpperCase() || 'S'}
                                </div>
                                <div className="flex gap-2">
                                    {seller.isBanned ? (
                                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">Banned</span>
                                    ) : (
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Verified</span>
                                    )}
                                </div>
                            </div>

                            <h4 className="text-xl font-bold text-gray-900 mb-1">{seller.sellerProfile?.shopName || 'Unknown Shop'}</h4>
                            <p className="text-sm text-gray-500 mb-4">{seller.name} • {seller.email}</p>

                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-gray-400 mt-1 shrink-0" />
                                    <p className="text-sm text-gray-600">
                                        {seller.sellerProfile?.address?.street}, {seller.sellerProfile?.address?.city}, {seller.sellerProfile?.address?.state}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={18} className="text-gray-400" />
                                    <p className="text-sm text-gray-600 font-mono">{seller.sellerProfile?.address?.phone}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CreditCard size={18} className="text-gray-400" />
                                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded w-full">
                                        <p>UPI: {seller.sellerProfile?.bankingInfo?.upiId || 'N/A'}</p>
                                        <p>Acc: {seller.sellerProfile?.bankingInfo?.accountNo || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {seller.isBanned && (
                                <div className="mt-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
                                    <strong>Reason:</strong> {seller.banReason}
                                </div>
                            )}

                            {/* Future Stats Placeholders */}
                            <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                                <div className="bg-gray-50 p-2 rounded">
                                    <p className="text-xs text-gray-500">Products</p>
                                    <p className="font-bold text-gray-800">--</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded">
                                    <p className="text-xs text-gray-500">Earnings</p>
                                    <p className="font-bold text-green-600">--</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex gap-2">
                                <button
                                    onClick={() => handleBan(seller._id, seller.isBanned)}
                                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${seller.isBanned
                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            : 'bg-red-500 text-white hover:bg-red-600'
                                        }`}
                                >
                                    {seller.isBanned ? 'Unban Seller' : 'Ban Seller'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Sellers;
