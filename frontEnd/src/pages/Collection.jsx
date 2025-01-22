import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import ProductItems from '../components/ProductItems';

const Collection = () => {
  const { products, search } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  // Toggle Category Selection
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Toggle Subcategory Selection
  const subToggleCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Apply Filters
  const applyFilter = () => {
    let productCopy = products.slice();

    if (search) {
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productCopy = productCopy.filter((item) => category.includes(item.category));
    }
    if (subCategory.length > 0) {
      productCopy = productCopy.filter((item) => subCategory.includes(item.subCategory));
    }
    setFilterProducts(productCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, products]);

  return (
    <div className='flex flex-col sm:flex-row gap-6 sm:gap-10 pt-10 border-t border-gray-200'>
      {/* Filter Options */}
      <div className="min-w-60 sm:w-1/4 bg-white shadow-lg rounded-xl p-6">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-800 mb-4"
        >
          FILTER
          <img
            src={assets.dropdown_icon}
            className={`h-5 transform transition-transform duration-300 sm:hidden ${showFilter ? 'rotate-180' : ''}`}
            alt="dropdown icon"
          />
        </p>

        {/* Category Filter */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilter ? 'max-h-screen' : 'max-h-0'} sm:max-h-screen`}>
          <div className="border-b border-gray-300 pb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">CATEGORIES</p>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                <input
                  className="w-4 h-4 accent-blue-600"
                  type="checkbox"
                  value="Men"
                  onChange={toggleCategory}
                />
                <span className="text-gray-700 font-medium">Men</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                <input
                  className="w-4 h-4 accent-blue-600"
                  type="checkbox"
                  value="Women"
                  onChange={toggleCategory}
                />
                <span className="text-gray-700 font-medium">Women</span>
              </label>
            </div>
          </div>

          {/* Sub Category Filter */}
          <div className="mt-5">
            <p className="text-sm font-medium text-gray-700 mb-3">TYPE</p>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                <input
                  className="w-4 h-4 accent-blue-600"
                  type="checkbox"
                  value="Topwear"
                  onChange={subToggleCategory}
                />
                <span className="text-gray-700 font-medium">Top Wear</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md">
                <input
                  className="w-4 h-4 accent-blue-600"
                  type="checkbox"
                  value="Bottomwear"
                  onChange={subToggleCategory}
                />
                <span className="text-gray-700 font-medium">Bottom Wear</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Product Side */}
      <div className="flex-1">
        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (
              <ProductItems
                key={index}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                rental_price={item.rental_price}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
