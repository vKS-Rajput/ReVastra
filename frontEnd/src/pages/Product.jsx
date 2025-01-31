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

  // Fetch product data
  const fetchProductData = async () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!size) {
      toast.error('Please select a size before adding to cart.');
      return;
    }

    if (productData && !productData.isAvailable) {
      toast.error('This product is out of stock!');
      return;
    }

    try {
      await addToCart(productData._id, size);
      toast.success(`${productData.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100" style={{ marginTop: '90px' }}>
      <div className="flex flex-col sm:flex-row gap-12 sm:gap-12">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className={`w-[18%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer transition-transform hover:scale-105 duration-300 ${
                  image === item ? 'border-2 border-gray-400' : ''
                }`}
                alt={`Product ${index}`}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              src={image}
              alt="Selected product"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-bold text-3xl mt-2 text-gray-800">{productData.name}</h1>
          <div className="mt-5">
            <p className="text-lg text-gray-400 line-through">Original: {currency}{productData.price}</p>
            <p className="text-4xl font-semibold text-[#ff6347] mt-2">
              Rent: {currency}{productData.rental_price}
              <span className="text-lg font-normal text-gray-600">/ day</span>
            </p>
            <p className="text-sm text-gray-600 font-medium mt-1">Low-cost rental option available</p>
          </div>
          <p className="mt-5 text-gray-600 md:w-4/5 font-medium text-lg">{productData.description}</p>

          {/* Select Size */}
          <div className="flex flex-col gap-4 my-8">
            <p className="text-lg font-semibold">Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  className={`border py-2 px-4 text-sm rounded-md transition-colors duration-300 ${
                    item === size ? 'bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  key={index}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="px-6 py-3 mt-4 bg-[#E63946] text-white rounded-lg shadow-md hover:bg-[#e5533f] transition duration-300"
            disabled={!size || !productData.isAvailable}
          >
            {productData.isAvailable ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* Enhanced Description Section */}
          <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Why Choose This Product?</h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>High-quality materials for maximum durability.</li>
              <li>Stylish and versatile design to suit any occasion.</li>
              <li>Affordable rental options with flexible durations.</li>
              <li>Customer satisfaction guaranteed with excellent reviews.</li>
            </ul>
            <p className="mt-4 text-gray-600">Our products are carefully curated to meet your needs and deliver the best value for your money. Experience the perfect blend of style and functionality with every purchase.</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Product;
