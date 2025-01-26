import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, getDeliveryFee, getCartAmount } = useContext(ShopContext);

  // Calculate totals
  const subtotal = getCartAmount();
  const deliveryFee = parseFloat(getDeliveryFee());
  const total = subtotal + deliveryFee;

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
          <p className="font-semibold text-gray-800">
            {currency} {subtotal.toFixed(2)}
          </p>
        </div>

        {/* Shipping Fee */}
        <div className="flex justify-between items-center border-b pb-2">
          <p className="text-gray-600 font-medium">Shipping Fee</p>
          <p className="font-semibold text-gray-800">
            {currency} {deliveryFee.toFixed(2)}
          </p>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2">
          <p className="text-lg font-bold text-gray-800">Total</p>
          <p
            className={`text-lg font-bold transition-transform transform hover:scale-105 text-[#E63946]`}
          >
            {currency} {total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
