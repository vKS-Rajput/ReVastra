import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { products, currency, cartItems, updateDuration, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              duration: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="container-custom pt-10 pb-20 min-h-[80vh]">
      <div className="mb-10 text-center">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {cartData.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
          <div className="w-20 h-20 bg-white dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
            <ShoppingBag size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-2xl font-display font-bold text-neutral-800 dark:text-neutral-200 mb-2">Your cart is empty</h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Looks like you haven't added any items yet.</p>
          <Link to="/collection" className="btn-primary inline-flex items-center gap-2">
            Start Renting <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);
              if (!productData) return null;

              return (
                <div key={index} className="bg-white dark:bg-neutral-800 p-4 sm:p-6 rounded-2xl shadow-soft border border-neutral-100 dark:border-neutral-700 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:shadow-medium transition-all duration-300">

                  {/* Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                    <img className="w-full h-full object-cover" src={productData.image[0]} alt={productData.name} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display font-bold text-lg text-neutral-800 dark:text-neutral-200 truncate pr-4">{productData.name}</h3>
                      <button onClick={() => updateDuration(item._id, item.size, 0)} className="text-neutral-400 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      <div className="bg-neutral-50 dark:bg-neutral-700 px-3 py-1 rounded-lg border border-neutral-100 dark:border-neutral-600">Size: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{item.size}</span></div>
                      <div className="bg-neutral-50 dark:bg-neutral-700 px-3 py-1 rounded-lg border border-neutral-100 dark:border-neutral-600">Price: <span className="font-semibold text-primary-600 dark:text-primary-400">{currency}{productData.rental_price}/day</span></div>
                    </div>

                    {/* Duration Control */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1"><Clock size={14} /> Duration:</span>
                      <div className="flex items-center border border-neutral-200 dark:border-neutral-600 rounded-lg overflow-hidden">
                        <button onClick={() => updateDuration(item._id, item.size, Math.max(1, item.duration - 1))} className="px-3 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300">-</button>
                        <input
                          className="w-12 text-center py-1 text-sm font-semibold outline-none bg-transparent dark:text-neutral-200"
                          type="number" min={1} value={item.duration}
                          onChange={(e) => updateDuration(item._id, item.size, Number(e.target.value))}
                        />
                        <button onClick={() => updateDuration(item._id, item.size, item.duration + 1)} className="px-3 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300">+</button>
                      </div>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">days</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-5 flex gap-4 items-start">
              <ShieldCheck className="text-blue-500 shrink-0 mt-0.5" size={24} />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-bold mb-1">Open Box Delivery & Security</p>
                <p className="opacity-80">All items are verified at delivery. You must provide a valid ID proof and sign the digital contract upon receipt.</p>
              </div>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:w-96 shrink-0">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-soft border border-neutral-100 dark:border-neutral-700 sticky top-24">
              <Title text1="ORDER" text2="SUMMARY" />
              <div className="mt-6">
                <CartTotal />
              </div>
              <button onClick={() => navigate("/placeorder")} className="w-full btn-primary mt-8 flex items-center justify-center gap-2 group">
                Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
