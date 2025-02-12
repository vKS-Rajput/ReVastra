import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const MyListings = () => {
  const { backEndURL, token, currency } = useContext(ShopContext);
  const [myProducts, setMyProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch user-specific products
  const fetchMyListings = async () => {
    try {
      if (!token) return;
      const response = await axios.get(backEndURL + '/api/product/my-listings', {
        headers: { token },
      });

      if (response.data.success) {
        setMyProducts(response.data.products.reverse());
        setFilteredProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch listings');
    }
  };

  // Remove product function
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backEndURL + '/api/product/remove',
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchMyListings();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to remove product');
    }
  };

  // Update Product Status
  const updateProductStatus = async (id, status) => {
    try {
      const response = await axios.put(
        backEndURL + `/api/product/update-status/${id}`,
        { status },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(`Product status updated to "${status}"`);
        fetchMyListings();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update status');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setFilteredProducts(myProducts);
    } else {
      const filtered = myProducts.filter(item =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">My Listings</h1>

      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search by Product Name"
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border rounded-md w-60"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 border bg-blue-100 text-sm rounded-lg shadow-md">
          <b>Image</b>
          <b>Details</b>
          <b>Category</b>
          <b>Price</b>
          <b>Status</b>
          <b>Action</b>
        </div>

        {filteredProducts.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 py-3 px-4 border bg-white hover:bg-gray-50 text-sm rounded-lg shadow-sm transition-all duration-200"
          >
            <img className="w-16 h-16 object-cover rounded-md border" src={item.image[0]} alt={item.name} />

            <div className="flex flex-col">
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-gray-600">📍 {item.pickuplocation}</p>
              <p className="text-gray-600">ID: <span className='text-red-600 font-bold'>{item._id}</span></p>
            </div>

            <p className="text-gray-600">{item.category}</p>
            <p className="text-blue-600 font-semibold">{currency}{item.price}</p>

            <select
              className="border rounded-md py-1 px-2 text-sm bg-gray-100 cursor-pointer"
              value={item.status || 'available'}
              onChange={(e) => updateProductStatus(item._id, e.target.value)}
            >
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <button
              onClick={() => removeProduct(item._id)}
              className="text-red-600 hover:text-red-800 font-medium cursor-pointer text-center transition-all duration-200"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyListings;
