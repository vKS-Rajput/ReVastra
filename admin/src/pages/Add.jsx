import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backEndURL } from "../App";
import { toast } from "react-toastify";

const Add = ({token}) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [rental_price, setRentalPrice] = useState("");

  useEffect(() => {
    return () => {
      image1 && URL.revokeObjectURL(image1);
      image2 && URL.revokeObjectURL(image2);
      image3 && URL.revokeObjectURL(image3);
      image4 && URL.revokeObjectURL(image4);
    };
  }, [image1, image2, image3, image4]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image1 && !image2 && !image3 && !image4) {
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
      formData.append("rental_price", rental_price)
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post( backEndURL + "/api/product/add", formData, {headers:{token}});

      if (response.data.success) {
        toast.success(response.data.success)
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
        setRentalPrice('');
        
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-center gap-6 p-6 bg-white shadow-xl rounded-lg max-w-4xl mx-auto hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Section: Image Upload */}
      <div className="w-full">
        <p className="text-lg font-bold mb-4">Upload Product Images</p>
        <div className="flex justify-center gap-6">
          {[setImage1, setImage2, setImage3, setImage4].map((setImage, index) => (
            <label
              key={index}
              htmlFor={`image${index + 1}`}
              className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:border-[#E63946] transition-colors duration-300"
            >
              <img
                className="w-24 h-24 object-cover rounded-md"
                src={!eval(`image${index + 1}`) ? assets.upload_area : URL.createObjectURL(eval(`image${index + 1}`))}
                alt="Upload Preview"
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
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

export default Add;
