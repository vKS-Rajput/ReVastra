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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    
    if (images.every(image => !image)) {
      toast.error("Please upload at least one image.");
      setLoading(false);
      return;
    }
    
    if (sizes.length === 0) {
      toast.error("Please select at least one size.");
      setLoading(false);
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
      toast.error(error.response?.data?.message || "Failed to upload product.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-center mt-20 gap-6 p-6 bg-white shadow-xl rounded-lg max-w-4xl mx-auto hover:shadow-2xl transition-shadow duration-300">
      {loading && <p className="text-red-500 font-bold">Uploading... Please wait for a few seconds.</p>}
      
      <div className="w-full">
        <p className="text-lg font-bold mb-4">Upload Product Images</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center">
          {images.map((image, index) => (
            <label key={index} htmlFor={`image${index + 1}`} className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:border-[#E63946] transition-colors duration-300">
              <img className="w-24 h-24 object-cover rounded-md" src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="Upload Preview" />
              <input onChange={(e) => onImageChange(index, e.target.files[0])} type="file" id={`image${index + 1}`} hidden />
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-center w-full">
        <button type="submit" disabled={loading} className={`w-64 py-3 mt-6 text-white font-bold rounded-md transition-colors duration-300 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#E63946] hover:bg-[#D7263D]"}`}>
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default Lend;
