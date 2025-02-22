import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ShoppingBag,
  DollarSign,
  Phone,
  User,
  LogOut,
  PlusCircle,
  Info,
  FileText,
  Package,
} from 'lucide-react';

const NavBar = () => {
  const [isProfileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const { getCartCount, token, setToken, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    navigate('/signIn');
  };

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
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Borrow', path: '/collection', icon: <ShoppingBag size={20} /> },
    { name: 'My Products', path: '/myProducts', icon: <Package size={20} />, requiresAuth: true },
    { name: 'Orders', path: '/orders', icon: <ShoppingBag size={20} />, requiresAuth: true },
    
  ];
  

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      {/* Top Navbar for Large Screens */}
      <div className="hidden sm:flex justify-between items-center py-3 px-4 sm:px-10">
        <Link to="/" className="flex items-center">
          <img src={assets.logo} className="w-20 sm:w-24" alt="ReVastra Logo" />
        </Link>

        <div className="flex gap-6 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.requiresAuth && !token ? '/signin' : link.path}
              className={({ isActive }) =>
                `flex items-center gap-1 text-sm ${isActive ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'}`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingBag size={24} className="text-gray-700" />
            <span className="absolute -top-2 -right-2 w-5 h-5 text-xs font-semibold flex items-center justify-center bg-red-500 text-white rounded-full">
              {getCartCount()}
            </span>
          </Link>

          <div
            className="relative profile-icon cursor-pointer"
            onClick={() => (token ? toggleProfileDropdown() : navigate('/signin'))}
          >
            <img className="w-5 rounded-full" src={assets.profile_icon} alt="Profile" />
            <AnimatePresence>
              {token && isProfileDropdownVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg profile-dropdown"
                >
                  <div className="py-3 px-4 text-gray-600 space-y-3">
                    <button onClick={() => navigate('/profile')} className="flex items-center gap-2 hover:text-black">
                      <User size={18} /> My Profile
                    </button>
                    <button onClick={() => navigate('/lend')} className="flex items-center gap-2 hover:text-black">
                      <PlusCircle size={18} /> Upload Product
                    </button>
                    <button onClick={() => navigate('/myProducts')} className="flex items-center gap-2 hover:text-black">
                      <Package size={18} /> My Products
                    </button>
                    <button onClick={() => navigate('/orders')} className="flex items-center gap-2 hover:text-black">
                      <ShoppingBag size={18} /> Orders
                    </button>
                    <button onClick={() => navigate('/my_earning')} className="flex items-center gap-2 hover:text-black">
                      <DollarSign size={18} /> My Earning
                    </button>
                    <button onClick={() => navigate('/about')} className="flex items-center gap-2 hover:text-black">
                      <Info size={18} /> About
                    </button>
                    <button onClick={() => navigate('/ourPolicy')} className="flex items-center gap-2 hover:text-black">
                      <FileText size={18} /> Policy
                    </button>
                    <button onClick={() => navigate('/contact')} className="flex items-center gap-2 hover:text-black">
                      <Phone size={18} /> Contact
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
        </div>
      </div>

      {/* Mobile Top Navbar */}
      <div className="sm:hidden flex justify-between items-center py-4 px-4 border-b border-gray-200">
        <Link to="/" className="flex items-center">
          <img src={assets.logo} className="w-20" alt="ReVastra Logo" />
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingBag size={24} className="text-gray-700" />
            <span className="absolute -top-2 -right-2 w-5 h-5 text-xs font-semibold flex items-center justify-center bg-red-500 text-white rounded-full">
              {getCartCount()}
            </span>
          </Link>
          <div
            className="relative profile-icon cursor-pointer"
            onClick={() => (token ? toggleProfileDropdown() : navigate('/signin'))}
          >
            <img className="w-6 rounded-none" src={assets.profile_icon} alt="Profile" />
            <AnimatePresence>
              {token && isProfileDropdownVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg profile-dropdown"
                >
                  <div className="py-3 px-4 text-gray-600 space-y-3">
                    <button onClick={() => navigate('/profile')} className="flex items-center gap-2 hover:text-black">
                      <User size={18} /> My Profile
                    </button>
                    <button onClick={() => navigate('/myProducts')} className="flex items-center gap-2 hover:text-black">
                      <Package size={18} /> My Products
                    </button>
                    <button onClick={() => navigate('/orders')} className="flex items-center gap-2 hover:text-black">
                      <ShoppingBag size={18} /> Orders
                    </button>
                    <button onClick={() => navigate('/my_earning')} className="flex items-center gap-2 hover:text-black">
                      <DollarSign size={18} /> My Earning
                    </button>
                    <button onClick={() => navigate('/about')} className="flex items-center gap-2 hover:text-black">
                      <Info size={18} /> About
                    </button>
                    <button onClick={() => navigate('/ourPolicy')} className="flex items-center gap-2 hover:text-black">
                      <FileText size={18} /> Policy
                    </button>
                    <button onClick={() => navigate('/contact')} className="flex items-center gap-2 hover:text-black">
                      <Phone size={18} /> Contact
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
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-70 bg-white border-t border-gray-200 py-5 shadow-lg">
        <div className="flex justify-between items-center px-6 relative">
          {navLinks.slice(0, 3).map((link) => (
            <NavLink
              key={link.name}
              to={link.requiresAuth && !token ? '/signin' : link.path}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs ${isActive ? 'text-black font-semibold' : 'text-gray-600'}`
              }
            >
              {link.icon}
            </NavLink>
          ))}

          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4">
            <Link
              to="/lend"
              className="flex flex-col items-center bg-black text-white p-4 rounded-full shadow-lg"
            >
              <PlusCircle size={28} />
            </Link>
          </div>

          {navLinks.slice(2).map((link) => (
            <NavLink
              key={link.name}
              to={link.requiresAuth && !token ? '/signin' : link.path}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs ${isActive ? 'text-black font-semibold' : 'text-gray-600'}`
              }
            >
              {link.icon}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;