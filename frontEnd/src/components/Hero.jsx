import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Hero = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/collection');
  };

  return (
    <div
      className="relative flex items-center justify-center h-screen bg-gradient-to-br from-[#333333] via-[#1a1a1a] to-[#0f0f0f] overflow-hidden"
      style={{ marginTop: '80px' }}>
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        autoPlay
        loop
        muted
      >
        <source src={assets.video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 sm:px-8 md:px-12 lg:px-20 max-w-4xl">
        <div className="flex flex-col items-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fadeInUp">
            Let’s Make Beautiful Flowers a Part of Your Life
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light mb-8 max-w-2xl animate-fadeIn">
            Explore a vibrant tapestry of blooms and arrangements that add color, fragrance, and elegance to your life. Discover the perfect floral expression for every moment and occasion.
          </p>
          <button
            onClick={handleShopNow}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-[#E63946] text-sm sm:text-lg font-semibold rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 hover:bg-[#D62828] animate-fadeOut"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 bg-pink-500 rounded-full opacity-30 blur-lg animate-pulse"></div>
      <div className="absolute top-[-20px] right-[-20px] w-60 h-60 bg-yellow-500 rounded-full opacity-30 blur-lg animate-pulse"></div>
    </div>
  );
};

export default Hero;
