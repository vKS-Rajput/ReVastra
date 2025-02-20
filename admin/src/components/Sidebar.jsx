import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-full sm:w-[240px] bg-gray-200 text-black min-h-screen shadow-md flex flex-col">
      {/* Sidebar Header */}
      <div className="py-6 text-center border-b border-gray-700">
        <h2 className="text-2xl font-bold text-black">Admin</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col mt-6">
        <NavLink
          to="/add"
          className="flex items-center px-6 py-3 hover:bg-[#E63946] hover:text-black transition-all duration-300"
        >
          Add Items
        </NavLink>
        <NavLink
          to="/list"
          className="flex items-center px-6 py-3 hover:bg-[#E63946] hover:text-black transition-all duration-300"
        >
          List Items
        </NavLink>
        <NavLink
          to="/orders"
          className="flex items-center px-6 py-3 hover:bg-[#E63946] hover:text-black transition-all duration-300"
        >
          Orders
        </NavLink>
        <NavLink
          to="/verification"
          className="flex items-center px-6 py-3 hover:bg-[#E63946] hover:text-black transition-all duration-300"
        >
          ID Verify
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;