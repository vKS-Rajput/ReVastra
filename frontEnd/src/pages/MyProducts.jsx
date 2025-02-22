import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const MyProducts = () => {
  const { backEndURL, token } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProductData = async () => {
    try {
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      setLoading(true);
      const response = await axios.get(`${backEndURL}/api/product/my-product`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        setError('Failed to fetch products.');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error fetching products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductData();
  }, [token]);

  if (loading) {
    return (
      <div className="border-t pt-24 bg-gray-50 flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t pt-24 bg-gray-50 flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="border-t pt-24 bg-gray-50 flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">You haven't uploaded any products yet.</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-24 bg-gray-50">
      <div className="text-2xl text-center font-semibold text-gray-800">
        <Title text1={'MY'} text2={'PRODUCTS'} />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8">
        {products.map((product, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
            <div className="flex items-start gap-4 sm:gap-6 text-sm">
              <img
                className="w-20 sm:w-24 h-24 sm:h-28 rounded-md object-cover"
                src={`${backEndURL}/${product.imageUrls[0]}`}
                alt={product.name}
              />
              <div>
                <p className="text-lg font-medium text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-500 mt-1">Size: {product.size}</p>
                <p className="text-sm text-gray-500 mt-1">Pickup: {product.pickuplocation}</p>
                <p className="text-sm text-gray-500 mt-1">Contact: {product.contactnumber}</p>
                <p className="text-sm text-gray-400 mt-2">Uploaded: {new Date(product.createdAt).toDateString()}</p>
              </div>
            </div>

            <div className="mt-4 border-t pt-4 text-sm text-gray-700">
              <p className="flex justify-between">
                <span>Rental Price:</span> <span>₹{product.rental_price}</span>
              </p>
              {product.best_seller && (
                <p className="flex justify-between text-green-600 font-semibold">
                  <span>Best Seller:</span> <span>Yes</span>
                </p>
              )}
              <p className={`flex justify-between font-bold mt-2 ${
                product.status === 'available' ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>Status:</span> <span>{product.status}</span>
              </p>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">{product.details}</p>
              <button
                onClick={loadProductData}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-all"
              >
                Refresh
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;
