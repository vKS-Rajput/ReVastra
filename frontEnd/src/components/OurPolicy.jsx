import React from 'react';
import { assets } from '../assets/assets';

const OurPolicy = () => {
  return (
    <div className="bg-gray-50 py-20">
      <div className="text-center mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Why Shop With Us?
        </h2>
        <p className="text-gray-600 mt-4 text-sm sm:text-base md:text-lg">
          We prioritize your convenience and satisfaction with every step.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-6 sm:px-12 lg:px-20">
        {/* Easy Exchange Policy */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow">
          <img
            src={assets.exchange_icon}
            className="w-16 h-16 mx-auto mb-4"
            alt="Easy Exchange Icon"
          />
          <h3 className="text-lg font-semibold text-gray-800">
            Easy Exchange Policy
          </h3>
          <p className="text-gray-600 mt-2">
            We offer a hassle-free exchange policy for your convenience.
          </p>
        </div>

        {/* Customer Support */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow">
          <img
            src={assets.support_img}
            className="w-16 h-16 mx-auto mb-4"
            alt="Customer Support Icon"
          />
          <h3 className="text-lg font-semibold text-gray-800">
            24/7 Customer Support
          </h3>
          <p className="text-gray-600 mt-2">
            Our team is here to assist you anytime, anywhere.
          </p>
        </div>

        {/* Add More Policy Cards */}
        {/* Example: Quality Assurance */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow">
          <img
            src={assets.quality_icon}
            className="w-16 h-16 mx-auto mb-4"
            alt="Quality Assurance Icon"
          />
          <h3 className="text-lg font-semibold text-gray-800">
            Quality Assurance
          </h3>
          <p className="text-gray-600 mt-2">
            Premium products ensuring exceptional quality for every purchase.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default OurPolicy;
