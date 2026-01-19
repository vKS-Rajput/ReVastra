import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { FaInfoCircle } from 'react-icons/fa';
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount, washingFee, includeWashing, toggleWashingFee } = useContext(ShopContext);
  const [showInfo, setShowInfo] = useState(false);

  // Calculate total price dynamically
  const totalPrice = getCartAmount() + delivery_fee + (includeWashing ? washingFee : 0);

  return (
    <div className="w-full bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6 relative">
      {/* Title */}
      <div className="text-center mb-6">
        <Title text1="CART" text2="TOTALS" />
      </div>

      {/* Totals Content */}
      <div className="flex flex-col gap-4 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between items-center border-b dark:border-neutral-700 pb-2">
          <p className="text-neutral-600 dark:text-neutral-400 font-medium">Subtotal</p>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">{currency} {getCartAmount()}.00</p>
        </div>

        {/* Platform Charge */}
        <div className="flex justify-between items-center border-b dark:border-neutral-700 pb-2">
          <p className="text-neutral-600 dark:text-neutral-400 font-medium">Platform Charge</p>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">{currency} {delivery_fee}.00</p>
        </div>

        {/* Washing Fee Checkbox with Info Icon */}
        <div className="flex justify-between items-center border-b dark:border-neutral-700 pb-2 relative">
          <label className="text-neutral-600 dark:text-neutral-400 font-medium flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4 cursor-pointer"
              checked={includeWashing}
              onChange={toggleWashingFee}
            />
            Add Washing Service ({currency}{washingFee}.00)
          </label>

          {/* Info Icon */}
          <FaInfoCircle
            className="text-neutral-500 dark:text-neutral-400 ml-2 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300"
            onClick={() => setShowInfo(!showInfo)}
          />

          {/* Tooltip for Washing Fee Details */}
          {showInfo && (
            <div className="absolute right-0 mt-2 w-60 p-3 bg-white dark:bg-neutral-700 border dark:border-neutral-600 rounded-lg shadow-lg text-neutral-700 dark:text-neutral-300 text-sm z-10">
              🧼 **Washing Service Includes:**
              - Gentle wash & stain removal
              - Ironing & fabric care
              - Ready-to-wear condition
              - Eco-friendly detergents 🌱
              <button
                className="text-red-500 mt-2 text-xs underline"
                onClick={() => setShowInfo(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2">
          <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">Total</p>
          <p className="text-lg font-bold transition-transform transform hover:scale-105 text-[#E63946]">
            {currency} {totalPrice}.00
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
