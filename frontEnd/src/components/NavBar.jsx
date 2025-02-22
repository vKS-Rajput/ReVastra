import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, User, ShoppingBag, LogOut, DollarSign, Package } from 'lucide-react';

const NavBar = () => {
  const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isProfileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const { getCartCount, token, setToken, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    navigate('/signIn');
  };

  const toggleMobileMenu = () => setMobileMenuVisible((prev) => !prev);
  const toggleProfileDropdown = () => setProfileDropdownVisible((prev) => !prev);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.profile-dropdown') && !e.target.closest('.profile-icon')) {
        setProfileDropdownVisible(false);
      }
    };
    if (isProfileDropdownVisible) document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isProfileDropdownVisible]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Borrow', path: '/collection' },
    { name: 'Lend', path: '/lend', requiresAuth: true },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Policy', path: '/ourPolicy' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="relative flex items-center justify-between py-4 px-6 sm:px-10">
        <Link to="/" className="flex items-center">
          <img src={assets.logo} className="w-28" alt="ReVastra Logo" />
        </Link>

        <ul className="hidden sm:flex gap-6 text-sm font-medium text-gray-700">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.requiresAuth && !token ? '/signin' : link.path}
              className={({ isActive }) => `hover:text-black ${isActive ? 'text-black font-semibold' : ''}`}
            >
              {link.name}
            </NavLink>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <div className="relative profile-icon cursor-pointer" onClick={() => (token ? toggleProfileDropdown() : navigate('/signin'))}>
            <img className="w-7 rounded-full" src={assets.profile_icon} alt="Profile" />
            <AnimatePresence>
              {token && isProfileDropdownVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg profile-dropdown"
                >
                  <div className="py-3 px-4 text-gray-600 space-y-3">
                    <button onClick={() => navigate('/profile')} className="flex items-center gap-2 hover:text-black">
                      <User size={18} /> My Profile
                    </button>
                    <button onClick={() => navigate('/myProducts')} className="flex items-center gap-2 hover:text-black">
                      <Package size={18} /> My Products
                    </button>
                    <button onClick={() => navigate('/my_earning')} className="flex items-center gap-2 hover:text-black">
                      <DollarSign size={18} /> My Earning
                    </button>
                    <button onClick={() => navigate('/orders')} className="flex items-center gap-2 hover:text-black">
                      <ShoppingBag size={18} /> Orders
                    </button>
                    <hr className="border-gray-200" />
                    <button onClick={logout} className="flex items-center gap-2 text-red-500 hover:text-red-600">
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-6" alt="Cart" />
            <span className="absolute -right-1 -bottom-1 w-5 h-5 text-xs font-semibold text-center bg-black text-white rounded-full">
              {getCartCount()}
            </span>
          </Link>

          <button onClick={toggleMobileMenu} className="sm:hidden focus:outline-none">
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuVisible && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 p-6 overflow-y-auto"
          >
            <button onClick={toggleMobileMenu} className="text-gray-700 mb-4">Close</button>
            <ul className="space-y-4 text-gray-700 text-base font-medium">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.requiresAuth && !token ? '/signin' : link.path}
                  onClick={() => setMobileMenuVisible(false)}
                  className={({ isActive }) => `block py-2 hover:text-black ${isActive ? 'font-semibold text-black' : ''}`}
                >
                  {link.name}
                </NavLink>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
