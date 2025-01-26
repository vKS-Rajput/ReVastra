import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backEndURL, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email.');
      return false;
    }
    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number.');
      return false;
    }
    return true;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = JSON.parse(JSON.stringify(products.find((product) => product._id === items)));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      if (method === 'cod') {
        const response = await axios.post(backEndURL + '/api/order/place', orderData, { headers: { token } });
        if (response.data.success) {
          toast.success('Order placed successfully!');
          navigate('/orders');
          setCartItems({});
        } else {
          toast.error(response.data.message);
        }
      } else if (method === 'razorpay') {
        const responseRazorpay = await axios.post(backEndURL + '/api/order/razorpay', orderData, { headers: { token } });
        if (responseRazorpay.data.success) {
          initPay(responseRazorpay.data.order);
        }
      }
    } catch (error) {
      console.error('Order Placement Error:', error);
      toast.error(error.response?.data?.message || 'Failed to place the order.');
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_key',
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backEndURL + '/api/order/verifyRazorpay',
            response,
            { headers: { token } }
          );
          if (data.success) {
            toast.success('Payment successful!');
            navigate('/orders');
            setCartItems({});
          }
        } catch (error) {
          console.error('Payment Verification Error:', error);
          toast.error('Payment verification failed. Please contact support.');
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col gap-6 pt-10 p-6 bg-gradient-to-r from-blue-50 to-gray-100 rounded-lg shadow-lg"
    >
      {/* Form and other elements as-is */}
    </form>
  );
};

export default PlaceOrder;
