import React from 'react';

const Navbar = ({setToken}) => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-200 shadow-md">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#E63946] text-white flex items-center justify-center font-bold rounded-md">
          RV
        </div>
        <h1 className="text-2xl font-semibold text-gray-700">Admin Panel</h1>
      </div>


      {/* Logout */}
      <button onClick={()=>setToken('')} className="px-4 py-2 bg-[#E63946] text-white rounded hover:bg-[#E63946] transition-all duration-300">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
