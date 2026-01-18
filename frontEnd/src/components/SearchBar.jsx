import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const SearchBar = () => {
  // Destructure values from the context
  const { search, setSearch } = useContext(ShopContext);

  // Get current location
  const location = useLocation();

  // Show search bar only on the Collection page
  const showSearchBar = location.pathname === '/collection';

  return showSearchBar ? (
    <div className='border-t border-b bg-gray-50 text-center' >
      <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-5 rounded-full w-3/4 sm:w-1/2'>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-1 outline-none bg-inherit text-sm'
          type="text"
          placeholder='Search'
        />
        <img className='w-4' src={assets?.search_icon || 'fallback-icon.png'} alt="Search icon" />
      </div>
    </div>
  ) : null;
}

export default SearchBar;
