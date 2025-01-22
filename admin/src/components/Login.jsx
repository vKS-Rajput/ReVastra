import React, { useState } from 'react';
import axios from 'axios';
import { backEndURL } from '../App';
import { toast } from 'react-toastify';

const Login = ({setToken}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    try {
        e.preventDefault();
        const response = await axios.post(backEndURL+ '/api/user/admin', {email,password});
        if (response.data.success) {
          setToken(response.data.token)
        } else {
          toast.error(response.data.message);
          
        }
        
    } catch (error) {
        console.log(error);
        toast.error(error.message);
        
    }
    
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      {/* Login Card */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Header */}
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Admin Login
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block mb-2 text-gray-300 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block mb-2 text-gray-300 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md transition-all duration-300"
            >
              Login
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-400">
          © 2024 Admin Panel. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
