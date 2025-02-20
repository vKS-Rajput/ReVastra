import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  const handleAddToCart = async () => {
    if (size) {
      try {
        await addToCart(productData._id, size);
        toast.success(`${productData.name} added to cart!`);
      } catch (error) {
        toast.error('Failed to add item to cart. Please try again.');
      }
    } else {
      toast.error('Please select a size before adding to cart.');
    }
  };

  return productData ? (
    <div className="mx-auto justify-center px-4 sm:px-6 lg:px-8 py-8" style={{ marginTop: '60px' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className=" justify-center flex flex-col sm:flex-row gap-4">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:w-24 w-full sm:h-[450px] gap-2">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                onClick={() => setImage(item)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border transition-transform duration-300 hover:scale-105 ${image === item ? 'border-gray-500' : 'border-gray-300'}`}
                alt={`Thumbnail ${index + 1}`}
              />
            ))}
          </div>
          <div className="w-auto ">
            <img
              src={image}
              alt="Selected product"
              className="w-full  h-auto object-contain rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="rounded-2xl shadow-2xl p-8 bg-white">
          <h1 className="font-bold text-4xl text-gray-800 mb-4">{productData.name}</h1>
          <p className={`text-lg font-medium mb-4 ${productData.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
            {productData.status === 'available' ? '✔ Available' : '✖ Out of Stock'}
          </p>

          <div className="mb-6">
            <p className="text-lg text-gray-400 line-through">Original: {currency}{productData.price}</p>
            <p className="text-3xl font-semibold text-red-500">
              Rent: {currency}{productData.rental_price}
              <span className="text-lg font-normal text-gray-600"> / day</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">Low-cost rental option available</p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-lg font-semibold mb-3">Product Details</p>
            <div className="h-auto overflow-y-auto pr-4 border-l-2 border-red-400 pl-4 rounded-md  space-y-2">
              {productData.description.split('\n').map((line, index) => (
                <p key={index} className="text-gray-700 text-sm leading-relaxed">{line}</p>
              ))}
            </div>
          </div>

          {/* Select Size */}
          <div className="mb-6">
            <p className="text-lg font-semibold mb-3">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    item === size ? 'bg-red-600 text-white border-red-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={productData.status !== 'available'}
            className={`w-full py-3 rounded-xl text-lg font-semibold transition-all ${
              productData.status === 'available'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {productData.status === 'available' ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Contract & Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
        <div className="p-6 border-2 border-red-400 bg-red-50 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-red-700 mb-4">Important: Contract & Delivery Process</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-3">
            <li>Users sign a contract upon delivery confirming compliance with policies.</li>
            <li>Delivery personnel verify product condition with video/photo proof.</li>
            <li><strong>Open Box Delivery:</strong> Inspect product at delivery time.</li>
            <li>Photo with product or valid ID required as proof of receipt.</li>
          </ul>
        </div>

        <div className="p-6 border-2 border-green-400 bg-green-50 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-green-700 mb-4">Why Rent With Us?</h2>
          <ul className="space-y-3 text-gray-700">
            <li>🚀 Quick & Hassle-Free Deliveries</li>
            <li>✅ Verified & Quality Checked Products</li>
            <li>🔄 Easy Returns & Refunds</li>
            <li>💵 Budget-Friendly Rental Plans</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-96">
      <p className="text-lg font-medium text-gray-600">Loading product details...</p>
    </div>
  );
};

export default Product;
