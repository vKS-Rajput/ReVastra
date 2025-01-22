import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const CartSummary = () => {
  const { cartItems, products, currency } = useContext(ShopContext);

  const calculateSubtotal = () => {
    let subtotal = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        const productData = products.find(product => product._id === items);
        if (productData && cartItems[items][item] > 0) {
          subtotal += productData.rental_price * cartItems[items][item];
        }
      }
    }
    return subtotal;
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = subtotal * 0.05; // Assuming 5% delivery fee
  const total = subtotal + deliveryFee;

  return (
    <div 
      className="w-full sm:max-w-full border border-gray-300 rounded-lg p-4" 
      style={{ marginTop: '80px' }} // Adjust this based on the navbar height
    >
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between mb-2">
        <span>Subtotal:</span>
        <span>{currency}{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Fee (5%):</span>
        <span>{currency}{deliveryFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-semibold">
        <span>Total:</span>
        <span>{currency}{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartSummary;
