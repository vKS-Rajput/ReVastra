import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backEndURL, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all products
  const fetchList = async () => {
    try {
      const response = await axios.get(backEndURL + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products.reverse());
        setFilteredList(response.data.products.reverse()); // Initialize filtered list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
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
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
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
        fetchList(); // Refresh product list
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
      setFilteredList(list);
    } else {
      const filtered = list.filter(item =>
        item._id.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredList(filtered);
    }
  };

  // Calculate rental price based on original price
  const calculateRentalPrice = (price) => {
    if (!price) return 0;
    return (parseFloat(price) * 0.2).toFixed(2); // 20% rental price
  };

  // Calculate charge based on rental price
  const calculateCharge = (rentalPrice) => {
    if (!rentalPrice) return 0;
    rentalPrice = parseFloat(rentalPrice);
    
    let chargeRate = 0.02; // Default 2%

    if (rentalPrice > 200 && rentalPrice <= 300) chargeRate = 0.05;
    else if (rentalPrice > 300 && rentalPrice <= 400) chargeRate = 0.07;
    else if (rentalPrice > 400 && rentalPrice <= 500) chargeRate = 0.1;
    else if (rentalPrice > 500) chargeRate = 0.15;

    return (rentalPrice * chargeRate).toFixed(2);
  };

  // Calculate estimated earnings (Rental Price - Charge)
  const calculateEstimatedEarnings = (price) => {
    const rentalPrice = calculateRentalPrice(price);
    const charge = calculateCharge(rentalPrice);
    return (rentalPrice - charge).toFixed(2);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">All Products</h1>

      {/* Search Input */}
      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search by Product ID"
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border rounded-md w-60"
        />
      </div>

      <div className="flex flex-col gap-4">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 border bg-blue-100 text-sm rounded-lg shadow-md">
          <b className="text-gray-700">Image</b>
          <b className="text-gray-700">Details</b>
          <b className="text-gray-700">Category</b>
          <b className="text-gray-700">Rental Price</b>
          <b className="text-gray-700">Charge</b>
          <b className="text-gray-700">Status</b>
          <b className="text-gray-700 text-center">Action</b>
        </div>

        {/* Product List */}
        {filteredList.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 py-3 px-4 border bg-white hover:bg-gray-50 text-sm rounded-lg shadow-sm transition-all duration-200"
          >
            {/* Image */}
            <img className="w-16 h-16 object-cover rounded-md border" src={item.image[0]} alt={item.name} />

            {/* Product Details */}
            <div className="flex flex-col">
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-gray-600">📍 {item.pickuplocation}</p>
              <p className="text-gray-600">📞 {item.contactno}</p>
              <p className="text-gray-600">👕 Sizes: {item.sizes?.join(', ') || 'N/A'}</p>
              <p className="text-gray-600">ID: <span className='text-red-600 font-bold'>{item._id}</span></p>
            </div>

            {/* Category */}
            <p className="text-gray-600">{item.category}</p>

           
            {/* Rental Price */}
            <p className="text-blue-600 font-semibold">{currency}{calculateRentalPrice(item.price)}</p>

            {/* Charge */}
            <p className="text-green-600 font-semibold">{currency}{calculateCharge(calculateRentalPrice(item.price))}</p>

          

            {/* Status */}
            <select
              className="border rounded-md py-1 px-2 text-sm bg-gray-100 cursor-pointer"
              value={item.status || 'available'}
              onChange={(e) => updateProductStatus(item._id, e.target.value)}
            >
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            {/* Remove Button */}
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

export default List;
