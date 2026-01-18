import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { MapPin, Phone, CreditCard, Wallet, AlertCircle, Info, Truck } from "lucide-react";

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

  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

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
        userId: JSON.parse(localStorage.getItem('user'))?._id,
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee + washingFee,
        deliveryFee: delivery_fee,
        washingFee: washingFee,
      };

      switch (method) {
        case "cod": {
          const response = await axios.post(
            backEndURL + "/api/order/place",
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
            toast.success("Order placed successfully!");
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        case "razorpay": {
          toast.error("Razorpay payment coming soon. Please use Cash on Delivery.");
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-10 min-h-[80vh]">
      <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row gap-10">

        {/* Left Side: Form */}
        <div className="flex-1 space-y-8">

          {/* Delivery Information */}
          <div>
            <h3 className="section-title mb-6 flex items-center gap-2 font-display text-xl font-semibold text-neutral-800">
              <MapPin className="text-primary-500" /> Delivery Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input required name="fullName" value={formData.fullName} onChange={onChangeHandler}
                  className="input-field" placeholder="Full Name" />
              </div>
              <input required name="hostel" value={formData.hostel} onChange={onChangeHandler}
                className="input-field" placeholder="Hostel (e.g., Block A)" />
              <input required name="block" value={formData.block} onChange={onChangeHandler}
                className="input-field" placeholder="Block No." />
              <input required name="room" value={formData.room} onChange={onChangeHandler}
                className="input-field" placeholder="Room No." />
              <input required name="phone" value={formData.phone} onChange={onChangeHandler}
                className="input-field" placeholder="Phone Number" />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="section-title mb-6 flex items-center gap-2 font-display text-xl font-semibold text-neutral-800">
              <CreditCard className="text-primary-500" /> Payment Method
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div onClick={() => setMethod('razorpay')}
                className={`p-4 border rounded-xl cursor-pointer flex items-center gap-3 transition-all duration-300
                            ${method === 'razorpay' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-neutral-200 hover:border-neutral-300'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${method === 'razorpay' ? 'border-primary-500' : 'border-neutral-300'}`}>
                  {method === 'razorpay' && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full"></div>}
                </div>
                <img src={assets.razorpay_logo} alt="Razorpay" className="h-6" />
              </div>

              <div onClick={() => setMethod('cod')}
                className={`p-4 border rounded-xl cursor-pointer flex items-center gap-3 transition-all duration-300
                            ${method === 'cod' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-neutral-200 hover:border-neutral-300'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${method === 'cod' ? 'border-primary-500' : 'border-neutral-300'}`}>
                  {method === 'cod' && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full"></div>}
                </div>
                <span className="font-medium text-neutral-700">Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 space-y-4">
            <div className="flex gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <p className="text-sm text-neutral-600"><span className="font-bold text-neutral-800">Important:</span> No delivery outside campus limits. Orders must be received within college premises.</p>
            </div>
            <div className="flex gap-3">
              <Truck className="text-primary-500 shrink-0" size={20} />
              <p className="text-sm text-neutral-600"><span className="font-bold text-neutral-800">Open Box Delivery:</span> Products will be verified at the time of delivery. ID proof required.</p>
            </div>
          </div>

        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-neutral-100 sticky top-24">
            <Title text1="CART" text2="TOTALS" />
            <CartTotal />
            <button type="submit" disabled={isLoading} className="w-full btn-primary mt-6 group flex items-center justify-center gap-2">
              {isLoading ? 'Processing...' : 'Place Order'}
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <Info size={14} />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default PlaceOrder;
