import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { backEndURL } = useContext(ShopContext);

  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your listed products.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${backEndURL}/api/product/my-product`, {
        headers: { token },
      });

      if (response.data.success) {
        setProducts(response.data.products.reverse()); // Display latest first
      } else {
        setError("Failed to fetch products.");
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError("An error occurred while loading your products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (products.length === 0) return <p className="text-center text-gray-500">You haven't listed any products yet.</p>;

  return (
    <div className="border-t mt-20 pt-24 bg-gray-50">
      <div className="text-2xl text-center font-semibold text-gray-800">
        <Title text1={'MY'} text2={'LISTED PRODUCTS'} />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {products.map((product, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
            <div className="flex items-start gap-4 text-sm">
              <img
                className="w-20 h-20 rounded-md object-cover"
                src={product.image?.[0] || '/placeholder.jpg'}
                alt={product.name}
              />
              <div>
                <p className="text-lg font-medium text-gray-800">{product.name}</p>
                <p className="mt-2 text-sm text-gray-500">Category: {product.category}</p>
                {product.subCategory && (
                  <p className="text-sm text-gray-400">Sub-Category: {product.subCategory}</p>
                )}
                <p className="mt-2 text-base font-semibold text-gray-700">
                  Price: ₹{product.price} | Rental: ₹{product.rental_price}/day
                </p>
                <p className="text-sm text-gray-400 mt-1">Pickup: {product.pickuplocation}</p>
                <p className="text-sm text-gray-400">Contact: {product.contactno}</p>
                <p className={`mt-2 text-sm font-medium ${
                  product.status === 'available' ? 'text-green-600' : 'text-red-600'
                }`}>
                  Status: {product.status}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t pt-4 text-sm text-gray-700">
              <p className="flex justify-between">
                <span>Sizes:</span> <span>{product.sizes?.join(", ") || "N/A"}</span>
              </p>
              <p className="flex justify-between mt-1">
                <span>Listed On:</span> <span>{new Date(product.date).toLocaleDateString()}</span>
              </p>
            </div>

            <button
              onClick={fetchMyProducts}
              className="mt-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              Refresh List
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;
