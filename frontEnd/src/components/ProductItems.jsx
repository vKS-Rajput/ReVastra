import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

const ProductItems = ({ id, image, name, price, rental_price, bestseller, date }) => {
    const { currency, addToWishlist, isInWishlist } = useContext(ShopContext);

    // Simple check for "New" badge (e.g., added within last 7 days)
    const isNew = Date.now() - date < 7 * 24 * 60 * 60 * 1000;
    const isWishlisted = isInWishlist(id);

    const handleWishlistClick = (e) => {
        e.preventDefault(); // Prevent navigation
        addToWishlist(id);
    };

    return (
        <Link
            className='group bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium border border-neutral-100 transition-all duration-300 transform hover:-translate-y-1 block'
            to={`/product/${id}`}
        >
            {/* Image Container */}
            <div className='relative w-full aspect-[4/5] overflow-hidden bg-neutral-100'>
                <img
                    className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110'
                    src={image[0]}
                    alt={name}
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {bestseller && (
                        <span className="bg-accent-amber text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm uppercase tracking-wider">
                            Best Seller
                        </span>
                    )}
                    {isNew && (
                        <span className="bg-accent-teal text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm uppercase tracking-wider">
                            New
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistClick}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-20 shadow-sm
                    ${isWishlisted ? 'bg-red-50 text-red-500 opacity-100' : 'bg-white/80 backdrop-blur-sm text-neutral-500 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'}`}
                >
                    <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "animate-pulse-once" : ""} />
                </button>

                {/* Overlay Action */}
                <div className='absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center'>
                    <span className="text-white text-sm font-medium flex items-center gap-1">
                        View Details <ArrowRight size={14} />
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className='p-4'>
                <h3 className='text-neutral-800 font-medium text-base truncate mb-1 group-hover:text-primary-500 transition-colors'>{name}</h3>

                <div className='flex items-end justify-between mt-2'>
                    <div>
                        <p className='text-xs text-neutral-500 uppercase tracking-wide font-semibold'>Rental Price</p>
                        <div className="flex items-baseline gap-1">
                            <span className='text-lg font-bold text-primary-600'>{currency}{rental_price}</span>
                            <span className="text-xs text-neutral-500">/day</span>
                        </div>
                    </div>
                    {price && (
                        <div className="text-right">
                            <p className='text-[10px] text-neutral-400'>Retail</p>
                            <p className='text-xs text-neutral-400 line-through decoration-neutral-300'>{currency}{price}</p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductItems;
