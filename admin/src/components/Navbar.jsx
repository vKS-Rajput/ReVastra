import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ setToken }) => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-200 shadow-md">
      {/* Logo, Title, and Dashboard Link */}
      <div className="flex items-center gap-4">
        <Link to="/" className="w-10 h-10 bg-[#E63946] text-white flex items-center justify-center font-bold rounded-md">
          RV
        </Link>
        <Link to="/" className="text-2xl font-semibold text-gray-700 hover:text-[#E63946] transition-all duration-300">
          Admin Panel
        </Link>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => setToken('')}
        className="px-4 py-2 bg-[#E63946] text-white rounded hover:bg-[#D62839] transition-all duration-300"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
