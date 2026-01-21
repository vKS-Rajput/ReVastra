import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { FaInfoCircle } from 'react-icons/fa';
import Title from './Title';
import { Zap } from 'lucide-react';

const CartTotal = ({ customSubtotal, urgentFee = 0, pricingBreakdowns = [] }) => {
  const { currency, delivery_fee, getCartAmount, washingFee, includeWashing, toggleWashingFee } = useContext(ShopContext);
  const [showInfo, setShowInfo] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Use custom subtotal from Cart.jsx if provided (tiered pricing), otherwise use simple calculation
  const subtotal = customSubtotal !== undefined ? customSubtotal : getCartAmount();

  // Calculate total price dynamically
  const totalPrice = subtotal + delivery_fee + (includeWashing ? washingFee : 0) + urgentFee;

  return (
    <div className="w-full bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6 relative">
      {/* Title */}
      <div className="text-center mb-6">
        <Title text1="CART" text2="TOTALS" />
      </div>

      {/* Totals Content */}
      <div className="flex flex-col gap-4 text-sm">
        {/* Subtotal with Tiered Breakdown */}
        <div className="border-b dark:border-neutral-700 pb-3">
          <div className="flex justify-between items-center">
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">Rental Subtotal</p>
            <p className="font-semibold text-neutral-800 dark:text-neutral-200">{currency} {subtotal.toFixed(0)}</p>
          </div>

          {/* Expandable Tiered Breakdown */}
          {pricingBreakdowns.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              >
                {showBreakdown ? 'Hide' : 'View'} pricing breakdown
              </button>

              {showBreakdown && (
                <div className="mt-2 space-y-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                  {pricingBreakdowns.map((item, idx) => (
                    <div key={idx} className="text-xs">
                      <p className="font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {item.productName} ({item.size}) - {item.days} days
                      </p>
                      <div className="space-y-0.5 text-neutral-500 dark:text-neutral-400 pl-2">
                        {item.breakdown.map((tier, i) => (
                          <div key={i} className="flex justify-between">
                            <span>
                              {tier.label}: {tier.days}d × {currency}{tier.rate}
                              {tier.percentage && <span className="text-amber-600"> ({tier.percentage})</span>}
                            </span>
                            <span>{currency}{tier.subtotal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Platform Charge */}
        <div className="flex justify-between items-center border-b dark:border-neutral-700 pb-2">
          <p className="text-neutral-600 dark:text-neutral-400 font-medium">Platform Charge</p>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">{currency} {delivery_fee}.00</p>
        </div>

        {/* Urgent Fee */}
        {urgentFee > 0 && (
          <div className="flex justify-between items-center border-b dark:border-neutral-700 pb-2">
            <p className="text-yellow-600 dark:text-yellow-400 font-medium flex items-center gap-1">
              <Zap size={14} /> Urgent Delivery
            </p>
            <p className="font-semibold text-yellow-600 dark:text-yellow-400">{currency} {urgentFee}.00</p>
          </div>
        )}

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
            <div className="absolute right-0 top-8 w-60 p-3 bg-white dark:bg-neutral-700 border dark:border-neutral-600 rounded-lg shadow-lg text-neutral-700 dark:text-neutral-300 text-sm z-10">
              🧼 <strong>Washing Service Includes:</strong>
              <ul className="mt-1 ml-4 list-disc text-xs">
                <li>Gentle wash & stain removal</li>
                <li>Ironing & fabric care</li>
                <li>Ready-to-wear condition</li>
                <li>Eco-friendly detergents 🌱</li>
              </ul>
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
            {currency} {totalPrice.toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
