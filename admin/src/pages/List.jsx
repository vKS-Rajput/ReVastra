import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backEndURL, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backEndURL + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

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

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">All Products</h1>
      <div className="flex flex-col gap-4">

        {/* ------- List Table Title ---------- */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 border bg-blue-100 text-sm rounded-lg shadow-md">
          <b className="text-gray-700">Image</b>
          <b className="text-gray-700">Name</b>
          <b className="text-gray-700">Category</b>
          <b className="text-gray-700">Price</b>
          <b className="text-center text-gray-700">Action</b>
        </div>

        {/* ------ Product List ------ */}
        {list.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 py-3 px-4 border bg-white hover:bg-gray-50 text-sm rounded-lg shadow-sm transition-all duration-200"
          >
            <img
              className="w-16 h-16 object-cover rounded-md border"
              src={item.image[0]}
              alt={item.name}
            />
            <p className="font-medium text-gray-800">{item.name}</p>
            <p className="text-gray-600">{item.category}</p>
            <p className="text-gray-500">{item.location}</p>
            <p className="text-gray-500">{item.phone}</p>
            <p className="text-gray-800 font-semibold">
              {currency}
              {item.rental_price}
            </p>
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
