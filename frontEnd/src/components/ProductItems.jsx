import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItems = ({ id, image, name, price, rental_price }) => {
    const { currency } = useContext(ShopContext);

    return (
        <Link
            className='relative block bg-white rounded-lg shadow-lg transition duration-300 transform hover:scale-105 overflow-hidden border border-gray-200 hover:border-transparent group'
            to={`/product/${id}`}
        >
            {/* Image Section with Hover Overlay */}
            <div className='relative w-full h-60 overflow-hidden'>
                <img
                    className='w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110'
                    src={image[0]}
                    alt={name}
                />

                {/* Hover Overlay with Button */}
                <div className='absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                    <button className='px-4 py-2 bg-[#E63946] text-white rounded-lg shadow-md hover:bg-red-700'>
                        View Details
                    </button>
                </div>
            </div>

            {/* Product Information */}
            <div className='p-4 bg-white relative'>
                <p className='text-lg font-semibold text-gray-900 truncate'>{name}</p>

                {/* Pricing Section */}
                <div className='flex justify-between items-center mt-2'>
                    <p className='text-sm text-gray-500 line-through'>{currency}{price}</p>
                    <p className='text-sm font-bold text-[#E63946]'>{currency}{rental_price} / day</p>
                </div>

                {/* Tagline for Rental */}
                <p className='text-xs text-gray-400 mt-1 italic'>Affordable rental at low cost!</p>
            </div>

            {/* "New" Badge */}
            {/* 
             <div className='absolute top-2 left-2 bg-[#E63946] text-white text-xs px-2 py-1 rounded-full shadow-md'>
                New
             </div> 
            */}

        </Link>
    );
};

export default ProductItems;
