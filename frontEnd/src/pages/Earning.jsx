import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Earning = () => {
    const { backEndURL, token, currency } = useContext(ShopContext);
    const [listedProducts, setListedProducts] = useState([]);

    useEffect(() => {
        const loadEarnings = async () => {
            if (!token) return;
    
            try {
                const response = await axios.post(
                    `${backEndURL}/api/orders/my_earnings`, 
                    { lenderId: token.userId }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                if (response.data.success) {
                    setListedProducts(response.data.orders);
                }
            } catch (error) {
                console.error('Error fetching earnings:', error);
            }
        };
    
        loadEarnings();
    }, [token, backEndURL]);
    

    return (
        <div className='border-t pt-24 bg-gray-50'>
            <div className='text-2xl text-center font-semibold text-gray-800'>
                <Title text1={'MY'} text2={'Listed Products'} />
            </div>

            {/* Display Listed Products */}
            <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 p-4'>
                {listedProducts.length > 0 ? (
                    listedProducts.map((product) => (
                        <div key={product._id} className='bg-white p-4 rounded-lg shadow-md'>
                            {/* Product Image */}
                            <img
                                src={product.image?.[0] || 'default-image.jpg'} 
                                alt={product.name}
                                className='w-full h-48 object-cover rounded-md'
                            />
                            {/* Product Details */}
                            <h3 className='text-lg font-semibold mt-2'>{product.name}</h3>
                            <p className='text-gray-600'>{product.description}</p>
                            <p className='text-gray-800 font-bold mt-2'>
                                Rental Price: {currency} {product.rental_price}
                            </p>
                            <p className='text-gray-600'>Category: {product.category}</p>
                            <p className='text-gray-600'>Sizes: {product.sizes?.join(', ') || 'N/A'}</p>
                            <p className='text-gray-600'>Pickup Location: {product.pickuplocation}</p>
                            <p className='text-gray-600'>Contact: {product.contactno}</p>
                            <p className='text-gray-600'>Status: 
                                <span className={`font-semibold ${product.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.status}
                                </span>
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No products listed yet.</p>
                )}
            </div>
        </div>
    );
};

export default Earning;
