import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import { Route, Routes } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Sellers from './pages/Sellers';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, useTheme } from './context/ThemeContext';

export const backEndURL = import.meta.env.VITE_BACKEND_URL;
export const currency = '₹';

const AppContent = ({ token, setToken }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <ToastContainer theme={darkMode ? 'dark' : 'light'} />
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Dashboard token={token} />} />
              <Route path="/add" element={<Add token={token} />} />
              <Route path="/list" element={<List token={token} />} />
              <Route path="/orders" element={<Orders token={token} />} />
              <Route path="/sellers" element={<Sellers token={token} />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <ThemeProvider>
      <AppContent token={token} setToken={setToken} />
    </ThemeProvider>
  );
};

export default App;
