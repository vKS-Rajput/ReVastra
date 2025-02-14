import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';

const NavBar = () => {
  const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isProfileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const { getCartCount, token, setToken, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate('/signIn');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownVisible((prev) => !prev);
  };

  const closeMenus = () => {
    setMobileMenuVisible(false);
    setProfileDropdownVisible(false);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest('.dropdown-menu') && !e.target.closest('.profile-icon')) {
      setProfileDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (isProfileDropdownVisible) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isProfileDropdownVisible]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'BORROW', path: '/collection' },
    { name: 'LEND', path: '/product_for_rent', requiresAuth: true },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="relative z-10 flex items-center justify-between py-5 px-4 sm:px-8 font-medium">
        <Link to="/" className="flex-shrink-0">
          <img src={assets.logo} className="w-[100px]" alt="ReVastra Logo" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.requiresAuth && !token ? '/signin' : link.path}
              className="flex flex-col items-center gap-1 hover:text-black"
            >
              {link.name}
              <hr className="w-2/4 border-none h-[2.5px] bg-gray-900 hidden group-hover:block" />
            </NavLink>
          ))}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Profile Icon */}
          <div className="relative profile-icon">
            <img
              onClick={() => {
                if (!token) {
                  navigate('/signin');
                } else {
                  toggleProfileDropdown();
                }
              }}
              className="w-5 cursor-pointer"
              src={assets.profile_icon}
              alt="Profile"
            />
            {token && isProfileDropdownVisible && (
              <div className="absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
                  <p onClick={() => navigate('/my_earning')} className="cursor-pointer hover:text-black">My Earning</p>
                  <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black">
                    Orders
                  </p>
                  <p onClick={logout} className="cursor-pointer hover:text-black">
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            aria-haspopup="true"
            aria-expanded={isMobileMenuVisible}
            onClick={toggleMobileMenu}
            className="sm:hidden focus:outline-none"
          >
            <img
              src={isMobileMenuVisible ? assets.cross_icon : assets.menu_icon}
              className="w-5 cursor-pointer"
              alt="Menu"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuVisible && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md max-h-screen overflow-auto transition-transform duration-300 transform">
          <ul className="flex flex-col items-center py-4 text-gray-700">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.requiresAuth && !token ? '/signin' : link.path}
                onClick={closeMenus}
                className="py-2 hover:text-black"
              >
                {link.name}
              </NavLink>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
