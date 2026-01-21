import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backEndURL, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { Calendar, Clock, Zap, Package } from 'lucide-react';

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
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft(null); // Return date passed
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial calculation

    return () => clearInterval(timer);
  }, [returnDateTime]);

  if (!timeLeft) {
    return <p className="text-sm text-red-500">Return date has passed!</p>;
  }

  return (
    <p className="text-md font-bold text-red-500">
      Timer: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </p>
  );
};

// Format date for display
const formatDate = (dateStr) => {
  if (!dateStr) return 'Not set';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const calculateExpirationDate = (orderDate, rentalDays) => {
    const orderDateObj = new Date(orderDate);
    orderDateObj.setDate(orderDateObj.getDate() + rentalDays);
    return orderDateObj;
  };

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(backEndURL + '/api/order/list', {}, { headers: { token } });
      if (response.data.success) {
        const updatedOrders = response.data.orders.reverse().map(order => {
          order.items.forEach(item => {
            const expirationDate = calculateExpirationDate(order.date, item.duration || 1);
            if (new Date() >= expirationDate) {
              item.status = 'Date Over';
            }
          });
          return order;
        });
        setOrders(updatedOrders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch orders.');
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backEndURL + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order status updated successfully!");
      } else {
        toast.error('Failed to update order status.');
      }
    } catch (error) {
      toast.error('Error updating order status.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Product ID copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy product ID.');
    });
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen px-10 py-12">
      <h3 className="text-4xl font-bold text-center text-gray-900 mb-10">All Orders</h3>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow"
          >
            {/* Urgent Badge */}
            {order.urgentOrder && (
              <div className="mb-4 flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg w-fit">
                <Zap size={18} className="text-yellow-600" />
                <span className="font-bold text-sm">⚡ URGENT ORDER - {currency}{order.urgentFee || 50} priority fee</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 items-start">
              {/* Order Icon */}
              <div className="flex justify-center">
                <img
                  className="w-20 h-20 object-contain rounded-xl"
                  src={assets.parcel_icon}
                  alt="Order Icon"
                />
              </div>

              {/* Order Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Details</h4>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between text-sm text-gray-600 mb-1">
                    <p>{item.name} ({item.size})</p>
                    <button
                      onClick={() => copyToClipboard(item._id)}
                      className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs px-2 py-0.5 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300"
                    >
                      📋 ID
                    </button>
                  </div>
                ))}
                <p className='mt-3 font-medium'>Name: {order.address.fullName}</p>
                <div className="text-sm text-gray-600">
                  <p>Hostel: {order.address.hostel}, Block: {order.address.block}</p>
                  <p>Room: {order.address.room}</p>
                  <p className="mt-1 font-medium">{order.address.phone}</p>
                </div>
              </div>

              {/* Rental Dates Section - NEW */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar size={18} className="text-blue-500" /> Rental Dates
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Start:</span>
                    <span className="font-medium text-gray-800">{formatDate(order.rentalStartDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">End:</span>
                    <span className="font-medium text-gray-800">{formatDate(order.rentalEndDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                    <span className="text-gray-500">Delivery:</span>
                    <span className="font-medium text-blue-600">{formatDate(order.deliveryDate)}</span>
                  </div>
                </div>
              </div>

              {/* Order Info & Timer */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Clock size={18} className="text-green-500" /> Order Info
                </h4>
                <p className="text-sm text-gray-600">Items: {order.items.length}</p>
                <p className="text-sm text-gray-600">Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p className="text-sm text-gray-600">
                  Placed: {new Date(order.date).toLocaleDateString()}
                </p>
                {order.status === 'Delivered' && (
                  <>
                    <p className="mt-1 text-sm text-red-500">
                      Return by:{' '}
                      <strong>
                        {new Date(
                          calculateExpirationDate(order.date, order.items[0]?.duration || 1)
                        ).toLocaleDateString()}
                      </strong>
                    </p>
                    <CountdownTimer
                      returnDateTime={calculateExpirationDate(order.date, order.items[0]?.duration || 1)}
                    />
                  </>
                )}
              </div>

              {/* Amount & Breakdown */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Package size={18} className="text-purple-500" /> Amount
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {currency}{order.amount}
                </p>

                {/* Pricing Breakdown */}
                {order.pricingBreakdown && order.pricingBreakdown.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    {order.pricingBreakdown.map((item, idx) => (
                      <div key={idx}>
                        <p className="font-medium">{item.productName}</p>
                        <p>{item.days} days = {currency}{item.total}</p>
                      </div>
                    ))}
                    {order.urgentFee > 0 && (
                      <p className="text-yellow-600 font-medium">
                        +{currency}{order.urgentFee} urgent
                      </p>
                    )}
                  </div>
                )}

                {/* Duration per item */}
                <div className="mt-3 space-y-1">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between text-sm text-gray-600">
                      <span>{item.duration || 1} days</span>
                      {item.status === 'Date Over' && (
                        <span className="text-red-500 font-semibold">Overdue!</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Status</h4>
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
