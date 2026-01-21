import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { LayoutDashboard, Package, List, ShoppingBag, Store, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/add', label: 'Add Product', icon: <Package size={18} /> },
    { to: '/list', label: 'Products', icon: <List size={18} /> },
    { to: '/orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
    { to: '/sellers', label: 'Sellers', icon: <Store size={18} /> },
  ];

  return (
    <nav className={`sticky top-0 z-50 shadow-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Re<span className="text-red-500">Vastra</span>
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${darkMode ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'}`}>Admin</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${isActive
                    ? 'bg-red-500 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {icon}
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${darkMode ? 'text-white' : 'text-gray-600'}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col gap-1">
              {navItems.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                    ${isActive
                      ? 'bg-red-500 text-white'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  {icon}
                  <span>{label}</span>
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium mt-2 ${darkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
