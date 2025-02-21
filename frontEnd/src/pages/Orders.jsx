import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

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
    return <p className="text-sm text-red-600">Return date has passed!</p>;
  }

  return (
    <p className="text-lg font-bold text-red-600">
      Time Left: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </p>
  );
};

const Orders = () => {
  const { backEndURL, token, currency, delivery_fee } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      setLoading(true);
      const response = await axios.post(
        `${backEndURL}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['deliveryFee'] = delivery_fee; // Add delivery fee
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error('Error loading order data:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalDate = (startDate, duration) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + duration);
    return start; // Return Date object with both date and time
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (loading) {
    return (
      <div className="border-t pt-24 bg-gray-50 flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t pt-24 bg-gray-50 flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-24 bg-gray-50">
      <div className="text-2xl text-center font-semibold text-gray-800">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8">
        {orderData.map((item, index) => {
          const returnDate = calculateFinalDate(item.date, item.duration); // Use item.duration instead of item.quantity

          // Calculate total price
          const washingFee = item.washingFee || 0;
          const totalPrice = item.rental_price * item.duration + item.deliveryFee + washingFee;

          return (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
              <div className="flex items-start gap-4 sm:gap-6 text-sm">
                <img className="w-16 sm:w-20 rounded-md" src={item.image[0]} alt={item.name} />
                <div>
                  <p className="text-lg font-medium text-gray-800">{item.name}</p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-2">
                    <p className="text-base font-semibold text-gray-700">
                      {currency}
                      {item.rental_price} x {item.duration} days
                    </p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">Date: {new Date(item.date).toDateString()}</p>
                  <p className="mt-1 text-sm text-gray-400">Payment Method: {item.paymentMethod}</p>

                  {/* Show Return Date & Countdown if Delivered */}
                  {item.status === 'Delivered' ? (
                    <>
                      <p className="mt-1 text-md text-red-600">
                        Return Date: <strong>{returnDate.toLocaleString()}</strong>
                      </p>
                      <CountdownTimer returnDateTime={returnDate} />
                    </>
                  ) : (
                    <p className="mt-1 text-gray-400">
                      Estimated Return: <strong>{returnDate.toLocaleString()}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Fee & Washing Fee Details */}
              <div className="mt-4 border-t pt-4 text-sm text-gray-700">
                <p className="flex justify-between">
                  <span>Rental Price:</span> <span>{currency}{item.rental_price * item.duration}.00</span>
                </p>
                <p className="flex justify-between">
                  <span>Delivery Fee:</span> <span>{currency}{item.deliveryFee}.00</span>
                </p>
                {washingFee > 0 && (
                  <p className="flex justify-between">
                    <span>Washing Fee:</span> <span>{currency}{washingFee}.00</span>
                  </p>
                )}
                <p className="flex justify-between text-lg font-bold text-red-600 mt-2">
                  <span>Total:</span> <span>{currency}{totalPrice}.00</span>
                </p>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                  <p
                    className={`min-w-2 h-2 rounded-full ${
                      item.status === 'Delivered'
                        ? 'bg-green-500'
                        : item.status === 'Pending'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <p className="text-sm font-medium text-gray-700">{item.status}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className="mt-4 sm:mt-0 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200 w-full sm:w-auto"
                >
                  Track Order
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;