import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backEndURL, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

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
            const expirationDate = calculateExpirationDate(order.date, item.quantity);
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
        fetchAllOrders();
      } else {
        toast.error('Failed to update order status.');
      }
    } catch (error) {
      toast.error('Error updating order status.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast('Product ID copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy product ID.');
    });
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen px-10 py-12">
      <h3 className="text-4xl font-bold text-center text-gray-900 mb-10">Your Orders</h3>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow transform hover:scale-105 duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
              <img
                className="w-24 h-24 object-contain rounded-xl transition-transform transform hover:scale-110"
                src={assets.parcel_icon}
                alt="Order Icon"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Details</h4>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between text-sm text-gray-600">
                    <p>{item.name} ({item.size})</p>
                    <button
                      onClick={() => copyToClipboard(item._id)}
                      className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs px-3 py-1 rounded-lg shadow-md hover:from-red-600 hover:to-red-800 hover:scale-55 active:scale-75 transition-all duration-300"
                    >
                      📋 Copy ID
                    </button>

                  </div>
                ))}
                <p className='mt-3 mb-2 font-medium'>Name: {order.address.fullName}</p>
                <div>
                  <p> Hostel: {order.address.hostel + ","}</p>
                  <p> Block: {order.address.block}</p>
                  <p>Room: {order.address.room}</p>
                </div>
                <p className="mt-2 text-gray-800 text-md font-medium">{order.address.phone}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Info</h4>
                <p className="text-sm text-gray-600">Items: {order.items.length}</p>
                <p className="text-sm text-gray-600">Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>
                {order.status === 'Delivered' && (
                  <p className="mt-1 text-md text-bold text-red-500">
                    Return Date:{' '}
                    <strong>
                      {new Date(
                        calculateExpirationDate(order.date, order.items[0].quantity)
                      ).toLocaleDateString()}
                    </strong>
                  </p>
                )}
                {order.status === 'Delivered' && (
                  <CountdownTimer
                    returnDateTime={calculateExpirationDate(order.date, order.items[0].quantity)}
                  />
                )}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Amount</h4>
                <p className="text-xl font-bold text-gray-900">
                  {currency}
                  {order.amount}
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Duration</h4>
                <div className="space-y-3">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between text-sm text-gray-600">
                      <span className="font-semibold">{item.quantity} days</span>
                      {item.status === 'Date Over' && (
                        <span className="text-red-500 font-semibold">Date Over</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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
