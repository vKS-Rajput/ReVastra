import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const Earning = () => {
    return (
        <div className='border-t pt-24 bg-gray-50 min-h-screen flex flex-col items-center justify-center'>
            <div className='text-2xl text-center font-semibold text-gray-800'>
                <Title text1={'MY'} text2={'Earning'} />
            </div>

            <div className='mt-8 text-lg text-gray-600 font-medium'>
                🚧 This page is under development. Stay tuned! 🚀
            </div>
        </div>
    );
};

export default Earning;
