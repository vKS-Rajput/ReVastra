import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Earning = () => {
    const { backEndURL, token, currency } = useContext(ShopContext);
    const [earningData, setEarningData] = useState([]);

    // Fetch user's earning data
    const loadEarningData = async () => {
        try {
            if (!token) {
                return null;
            }
            const response = await axios.post(
                backEndURL + '/api/order/my_earning',
                { userId: token.userId }, // Assuming token contains userId
                { headers: { token } }
            );
            if (response.data.success) {
                // Process the orders to calculate earnings
                const processedEarnings = response.data.orders.map((order) => {
                    const totalEarning = order.items.reduce((sum, item) => {
                        return sum + item.rental_price * item.quantity;
                    }, 0);
                    return {
                        ...order,
                        totalEarning,
                    };
                });
                setEarningData(processedEarnings);
            }
        } catch (error) {
            console.error('Error fetching earning data:', error);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadEarningData();
    }, [token]);

    return (
        <div className='border-t pt-24 bg-gray-50'>
            <div className='text-2xl text-center font-semibold text-gray-800'>
                <Title text1={'MY'} text2={'Earning'} />
            </div>

            {/* Display Earning Data */}
            <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-5 p-4'>
                {earningData.map((order) => (
                    <div key={order._id} className='bg-white p-4 rounded-lg shadow-md'>
                        <h3 className='text-lg font-semibold'>Order ID: {order._id}</h3>
                        <p className='text-gray-600'>Date: {new Date(order.date).toLocaleDateString()}</p>
                        <p className='text-gray-600'>Status: {order.status}</p>
                        <p className='text-gray-800 font-bold mt-2'>
                            Total Earning: {currency} {order.totalEarning}
                        </p>
                        <div className='mt-4'>
                            <h4 className='font-semibold'>Items:</h4>
                            {order.items.map((item) => (
                                <div key={item._id} className='ml-4 mt-2 flex items-center'>
                                    {/* Product Image */}
                                    <img
                                        src={item.image} // Ensure the backend provides the image URL
                                        alt={item.name}
                                        className='w-16 h-16 object-cover rounded-md'
                                    />
                                    <div className='ml-4'>
                                        <p>{item.name} (x{item.quantity})</p>
                                        <p className='text-gray-600'>
                                            Price: {currency} {item.rental_price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Earning;