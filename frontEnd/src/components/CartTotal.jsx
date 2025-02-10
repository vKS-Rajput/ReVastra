import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-6">
      {/* Title */}
      <div className="text-center mb-6">
        <Title text1="CART" text2="TOTALS" />
      </div>

      {/* Totals Content */}
      <div className="flex flex-col gap-4 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between items-center border-b pb-2">
          <p className="text-gray-600 font-medium">Subtotal</p>
          <p className="font-semibold text-gray-800">{currency} {getCartAmount()}.00</p>
        </div>

        {/* Shipping Fee */}
        <div className="flex justify-between items-center border-b pb-2">
          <p className="text-gray-600 font-medium">Platform Charge</p>
          <p className="font-semibold text-gray-800">{currency} {delivery_fee}</p>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2">
          <p className="text-lg font-bold text-gray-800">Total</p>
          <p className={`text-lg font-bold transition-transform transform hover:scale-105 text-[#E63946]`}>
            {currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
