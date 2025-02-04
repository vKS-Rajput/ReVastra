import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import axios from "axios";
import { backEndURL } from '../App';
import { assets } from '../../../admin/src/assets/assets';

const Lend = ({ token }) => {
  const [images, setImages] = useState([false, false, false, false]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [rental_price, setRentalPrice] = useState("");
  const [pickuplocation, setPickupLocation] = useState("");
  const [contactno, setContactNo] = useState("");

  useEffect(() => {
    return () => {
      images.forEach(image => image && URL.revokeObjectURL(image));
    };
  }, [images]);

  const onImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  
    if (images.every(image => !image)) {
      toast.error("Please upload at least one image.");
      return;
    }
  
    if (sizes.length === 0) {
      toast.error("Please select at least one size.");
      return;
    }
  
    try {
      const formData = new FormData();
  
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("rental_price", rental_price);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("pickuplocation", pickuplocation);
      formData.append("contactno", contactno);
  
      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
      });
  
      const response = await axios.post(backEndURL + "/api/product/lend", formData);
  
      if (response.data.success) {
        toast.success("✅ Product uploaded successfully!");
  
        // Reset the form fields
        setName('');
        setDescription('');
        setImages([false, false, false, false]);
        setPrice('');
        setRentalPrice('');
        setContactNo('');
        setPickupLocation('');
        setSizes([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(error.response?.data?.message || "Failed to upload product.");
    }
  };
  

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-center mt-20 gap-6 p-6 bg-white shadow-xl rounded-lg max-w-4xl mx-auto hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Section: Image Upload */}
      <div className="w-full">
        <p className="text-lg font-bold mb-4">Upload Product Images</p>
        <div className="flex justify-center gap-6">
          {images.map((image, index) => (
            <label
              key={index}
              htmlFor={`image${index + 1}`}
              className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:border-[#E63946] transition-colors duration-300"
            >
              <img
                className="w-24 h-24 object-cover rounded-md"
                src={!image ? assets.upload_area : URL.createObjectURL(image)}
                alt="Upload Preview"
              />
              <input
                onChange={(e) => onImageChange(index, e.target.files[0])}
                type="file"
                id={`image${index + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      {/* Section: Product Details */}
      <div className="w-full">
        <p className="text-lg font-bold mb-4">Product Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E63946] outline-none"
            type="text"
            placeholder="Product Name"
            required
          />
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E63946] outline-none"
            type="number"
            placeholder="Price (e.g., 250)"
            required
          />
          <input
            onChange={(e) => setRentalPrice(e.target.value)}
            value={rental_price}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E63946] outline-none"
            type="text"
            placeholder="Rental Price"
            required
          />
          <input
            onChange={(e) => setPickupLocation(e.target.value)}
            value={pickuplocation}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E63946] outline-none"
            type="text"
            placeholder="Pickup Location"
            required
          />
          <input
            onChange={(e) => setContactNo(e.target.value)}
            value={contactno}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E63946] outline-none"
            type="text"
            placeholder="Contact Number..."
            required
          />
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E63946] outline-none"
            required
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#E63946] outline-none"
            required
          >
            <option value="Topwear">Top Wear</option>
            <option value="Bottomwear">Bottom Wear</option>
          </select>
        </div>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full px-4 py-2 mt-4 border rounded-md focus:ring-2 focus:ring-[#E63946] outline-none"
          placeholder="Write Product Description"
          required
        />
      </div>

      {/* Section: Sizes */}
      <div className="w-full">
        <p className="text-lg font-bold mb-4">Available Sizes</p>
        <div className="flex gap-4">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
              className={`${
                sizes.includes(size)
                  ? "bg-[#E63946] text-white"
                  : "bg-gray-200"
              } px-4 py-2 cursor-pointer rounded-md hover:bg-[#E63946] hover:text-white transition-colors duration-300`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className="flex items-center gap-3 w-full">
        <input
          onChange={() => setBestSeller((prev) => !prev)}
          checked={bestSeller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer text-gray-700" htmlFor="bestseller">
          Add to Best Sellers
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center w-full">
        <button
          type="submit"
          className="w-64 py-3 mt-6 bg-[#E63946] text-white font-bold rounded-md hover:bg-[#D7263D] transition-colors duration-300"
        >
          Add Product
        </button>
      </div>
    </form>
  );
};

export default Lend;
