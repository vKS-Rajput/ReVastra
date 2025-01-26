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

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
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

      switch (method) {
        case 'cod':
          const response = await axios.post(backEndURL + '/api/order/place', orderData, { headers: { token } });
          if (response.data.success) {
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;

        case 'razorpay':
          const responseRazorpay = await axios.post(backEndURL + '/api/order/razorpay', orderData, { headers: { token } });
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backEndURL + '/api/order/verifyRazorpay',
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate('/orders');
            setCartItems({});
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
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
      {/* Delivery Info Section */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <Title text1="Delivery" text2="Information" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <input
            required
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            className="border rounded-md p-3 focus:ring-2 focus:ring-[#E63946]"
            placeholder="First Name"
          />
          
          <input
            required
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            className="border rounded-md p-3 focus:ring-2 focus:ring-[#E63946] col-span-2"
            placeholder="Email Address"
          />
          
          <input
            required
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            className="border rounded-md p-3 focus:ring-2 focus:ring-[#E63946]"
            placeholder="City"
          />
          <input
            name="state"
            value={formData.state}
            onChange={onChangeHandler}
            className="border rounded-md p-3 focus:ring-2 focus:ring-[#E63946]"
            placeholder="State"
          />
          <input
            required
            name="zipcode"
            value={formData.zipcode}
            onChange={onChangeHandler}
            className="border rounded-md p-3 focus:ring-2 focus:ring-[#E63946]"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            className="border rounded-md p-3 focus:ring-2 focus:ring-[#E63946]"
            placeholder="Country"
          />
          <input
            required
            name="phone"
            value={formData.phone}
            onChange={onChangeHandler}
            className="border rounded-md p-3 focus:ring-2 focus:ring-[#E63946] col-span-2"
            placeholder="Phone Number"
          />
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <Title text1="Payment" text2="Method" />
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div
            onClick={() => setMethod('razorpay')}
            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer shadow-sm transition-transform transform hover:scale-105 ${
              method === 'razorpay' ? 'border-[#E63946] bg-blue-50' : 'border-gray-300'
            }`}
          >
            <span className={`w-4 h-4 border rounded-full flex items-center justify-center ${
              method === 'razorpay' ? 'bg-[#E63946]' : ''
            }`}></span>
            <img className="h-6" src={assets.razorpay_logo} alt="Razorpay" />
          </div>
          <div
            onClick={() => setMethod('cod')}
            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer shadow-sm transition-transform transform hover:scale-105 ${
              method === 'cod' ? 'border-[#E63946] bg-blue-50' : 'border-gray-300'
            }`}
          >
            <span className={`w-4 h-4 border rounded-full flex items-center justify-center ${
              method === 'cod' ? 'bg-[#E63946]' : ''
            }`}></span>
            <p className="text-sm font-medium">Cash on Delivery</p>
          </div>
        </div>
      </div>

      {/* Cart Summary and Submit Button */}
      <div className="flex flex-col items-center bg-white p-6 rounded-md shadow-md">
        <CartTotal />
        <button
          type="submit"
          className="mt-6 w-full bg-[#E63946] text-white font-bold py-3 rounded-lg shadow-md hover:bg-[#E63946] transition duration-300"
        >
          Place Order
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
