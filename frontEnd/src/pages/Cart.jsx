import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 2) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-24 bg-gray-50 min-h-screen">
      <div className="text-2xl mb-6 text-center">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-0">
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          return (
            <div
              key={index}
              className="py-6 border-t border-gray-300 grid grid-cols-1 sm:grid-cols-[4fr_2fr_1fr] items-center gap-6"
            >
              {/* Product Image and Details */}
              <div className="flex items-start gap-6">
                <img
                  className="w-20 h-20 object-cover rounded-lg shadow"
                  src={productData.image[0]}
                  alt={productData.name}
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <p className="text-base">
                      {currency}
                      {productData.rental_price}
                    </p>
                    <p className="px-4 py-1 border rounded-lg bg-gray-100 text-sm">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Section */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">Duration</p>
                <div className="flex items-center justify-center gap-2">
                  <input
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateQuantity(
                            item._id,
                            item.size,
                            Number(e.target.value)
                          )
                    }
                    className="border w-16 text-center px-2 py-1 rounded-lg shadow-sm"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                  />
                  <span className="text-gray-700 text-sm font-medium">days</span>
                </div>
              </div>

              {/* Remove Button */}
              <div className="text-center mt-2 sm:mt-0">
                <p
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="bg-red-100 text-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-200 rounded-md px-3 py-1 text-sm sm:text-base"
                >
                  Remove
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Total and Checkout */}
      {cartData.length > 0 && (
        <div className="flex justify-center my-20">
          <div className="w-full sm:w-[700px] bg-white shadow-lg rounded-lg p-8">
            <CartTotal />

            <div className="w-full text-center mt-8">
              <button
                onClick={() => navigate("/placeorder")}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg rounded-full px-10 py-4 shadow-md hover:shadow-lg transition-all duration-300"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
