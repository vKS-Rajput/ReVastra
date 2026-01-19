import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

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
        setError(null);
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

  // Delete product function
  const deleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await axios.delete(
        `${backEndURL}/api/product/my-product/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Product deleted successfully!');
        loadProductData(); // Refresh the list
      } else {
        toast.error(response.data.message || 'Failed to delete product.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  useEffect(() => {
    loadProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return (
      <div className="border-t pt-24 bg-neutral-50 dark:bg-neutral-900 flex justify-center items-center h-screen">
        <p className="text-lg text-neutral-600 dark:text-neutral-400">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t pt-24 bg-neutral-50 dark:bg-neutral-900 flex justify-center items-center h-screen">
        <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="border-t pt-24 bg-neutral-50 dark:bg-neutral-900 flex flex-col justify-center items-center h-screen">
        <p className="text-lg text-neutral-600 dark:text-neutral-400">You haven't uploaded any products yet.</p>
        <a href="/lend" className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
          Upload Your First Product
        </a>
      </div>
    );
  }

  return (
    <div className="border-t pt-24 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      <div className="text-2xl text-center font-semibold text-neutral-800 dark:text-neutral-200">
        <Title text1={'MY'} text2={'PRODUCTS'} />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 pb-8">
        {products.map((product, index) => (
          <div key={index} className="bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-6 flex flex-col justify-between">
            <div className="flex items-start gap-4 sm:gap-6 text-sm">
              <img className="w-16 h-16 object-cover rounded-md border" src={product.image[0]} alt={product.name} />
              <div>
                <p className="text-lg font-medium text-neutral-800 dark:text-neutral-200">{product.name}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Size: {product.sizes?.join(', ') || 'N/A'}</p>
                <p className="text-neutral-600 dark:text-neutral-400">{product.category}</p>

                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Pickup: {product.pickuplocation}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Contact: {product.contactno}</p>
                <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-2">Uploaded: {new Date(product.date).toDateString()}</p>
              </div>
            </div>

            <div className="mt-4 border-t dark:border-neutral-700 pt-4 text-sm text-neutral-700 dark:text-neutral-300">
              <p className="flex justify-between">
                <span>Rental Price:</span> <span>₹{product.rental_price}</span>
              </p>
              {product.best_seller && (
                <p className="flex justify-between text-green-600 font-semibold">
                  <span>Best Seller:</span> <span>Yes</span>
                </p>
              )}
              <p className={`flex justify-between font-bold mt-2 ${product.status === 'available' ? 'text-green-600' : 'text-red-600'
                }`}>
                <span>Status:</span> <span>{product.status}</span>
              </p>
            </div>

            <div className="mt-4 flex justify-between items-center gap-2">
              <button
                onClick={loadProductData}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all"
              >
                Refresh
              </button>
              <button
                onClick={() => deleteProduct(product._id, product.name)}
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;
