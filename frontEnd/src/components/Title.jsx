import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4">
      {/* Title Text */}
      <p className="text-lg sm:text-xl text-gray-600">
        {text1}{' '}
        <span className="text-gray-900 font-semibold">{text2}</span>
      </p>
      
      {/* Divider */}
      <div className="flex-1 h-[2px] bg-gradient-to-r from-gray-700 to-gray-400"></div>
    </div>
  );
};

export default Title;
