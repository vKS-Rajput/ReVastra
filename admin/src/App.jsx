import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';

export const backEndURL = import.meta.env.VITE_BACKEND_URL
export const currency = '₹'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):''); // State to handle login token

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col text-black">
      <ToastContainer/>
      {/* If token is empty, show Login */}
      {token === '' ? (
        <Login setToken={setToken}/>
      ) : (
        <>
          {/* Navbar */}
          <Navbar setToken={setToken}/>

          {/* Main Layout */}
          <div className="flex flex-1">
            {/* Sidebar */} 
            <Sidebar />

            {/* Content Area */}
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-black text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
