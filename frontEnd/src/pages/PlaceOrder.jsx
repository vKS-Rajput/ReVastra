import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backEndURL,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    washingFee,
    products,
  } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    fullName: "",
    hostel: "",
    block: "",
    room: "",
    phone: "",
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
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.duration = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee + washingFee,
      };

      switch (method) {
        case "cod": {
          const response = await axios.post(
            backEndURL + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        case "razorpay": {
          const responseRazorpay = await axios.post(
            backEndURL + "/api/order/razorpay",
            orderData,
            { headers: { token } }
          );
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
          break;
        }

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
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backEndURL + "/api/order/verifyRazorpay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate("/orders");
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
      className="mt-20 flex flex-col gap-6 pt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-gray-100 rounded-lg shadow-lg w-full max-w-3xl mx-auto"
    >
      {/* Delivery Info */}
      <div className="bg-white p-4 sm:p-6 rounded-md shadow-md">
        <Title text1="Delivery" text2="Information" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <input
            required
            name="fullName"
            value={formData.fullName}
            onChange={onChangeHandler}
            className="border rounded-md p-3 focus:ring-2 focus:ring-[#E63946] w-full"
            placeholder="Full Name"
          />
          <input
            required
            name="hostel"
            value={formData.hostel}
            onChange={onChangeHandler}
            className="border rounded-md p-3 focus:ring-2 focus:ring-[#E63946] w-full"
            placeholder="Hostel Type"
          />
          <input
            required
            name="block"
            value={formData.block}
            onChange={onChangeHandler}
            className="border rounded-md p-3 focus:ring-2 focus:ring-[#E63946] w-full"
            placeholder="Block"
          />
          <input
            name="room"
            value={formData.room}
            onChange={onChangeHandler}
            className="border rounded-md p-3 focus:ring-2 focus:ring-[#E63946] w-full"
            placeholder="Room No."
          />
          <input
            required
            name="phone"
            value={formData.phone}
            onChange={onChangeHandler}
            className="border rounded-md p-3 focus:ring-2 focus:ring-[#E63946] w-full sm:col-span-2"
            placeholder="Phone Number"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-4 sm:p-6 rounded-md shadow-md">
        <Title text1="Payment" text2="Method" />
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {[{ id: "razorpay", label: "Razorpay", logo: assets.razorpay_logo }, { id: "cod", label: "Cash on Delivery" }].map((option) => (
            <div
              key={option.id}
              onClick={() => setMethod(option.id)}
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer shadow-sm transition-transform transform hover:scale-105 w-full ${method === option.id ? "border-[#E63946] bg-blue-50" : "border-gray-300"
                }`}
            >
              <span className={`w-4 h-4 border rounded-full flex items-center justify-center ${method === option.id ? "bg-[#E63946]" : ""}`}></span>
              {option.logo ? <img className="h-6" src={option.logo} alt={option.label} /> : <p className="text-sm font-medium">{option.label}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <div className="bg-white p-4 sm:p-6 rounded-md shadow-md flex flex-col items-center">
        <CartTotal />
        <button
          type="submit"
          className="mt-6 w-full bg-[#E63946] text-white font-bold py-3 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
        >
          Place Order
        </button>
      </div>

      {/* Note */}
      <div className="mt-6 text-center">
        <div className="inline-block bg-blue-50 border-l-4 border-red-500 p-4 rounded-md shadow-md max-w-lg w-full">
          <p className="text-sm text-red-800 font-medium">
            <strong className="block text-red-900">Important Note:</strong>
            No delivery outside the campus. Please order within the college campus.
          </p>
        </div>
      </div>

      {/* Contract Info */}
      <div className="mt-8 p-5 border-2 border-red-500 bg-red-100 rounded-lg max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-red-700">Contract & Delivery Process</h2>
        <ul className="list-disc pl-5 text-gray-700 mt-2 text-sm">
          <li>Users sign a contract upon delivery acknowledging the policies.</li>
          <li>Delivery personnel verify product condition with video/photo proof.</li>
          <li><strong>Open Box Delivery:</strong> Products are checked at delivery time.</li>
          <li>Users must provide a photo with the product or valid ID as proof of receipt.</li>
        </ul>
      </div>
    </form>
  );
};

export default PlaceOrder;
