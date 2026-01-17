import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const SignIn = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, user, setUser, navigate, backEndURL } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backEndURL + '/api/user/register', { name, email, password });

        if (response.data.success) {
          setToken(response.data.token);
          setUser(response.data.user); // Store user data in context
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data in localStorage
          toast.success("Account created successfully!");
          navigate('/'); // Navigate to home page
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backEndURL + '/api/user/login', { email, password });

        if (response.data.success) {
          setToken(response.data.token);
          setUser(response.data.user); // Store user data in context
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data in localStorage
          toast.success("Logged in successfully!");
          navigate('/'); // Navigate to home page
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser && storedUser !== 'undefined') {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount to check for stored credentials

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col items-center w-[90%] sm:max-w-[400px] m-auto mt-24 p-6 bg-white rounded-lg shadow-lg gap-4 text-gray-800'
    >
      <div className='inline-flex items-center gap-2 mb-4'>
        <p className='text-3xl font-semibold text-gray-800'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-600' />
      </div>

      {currentState === 'Sign Up' && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type='text'
          className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E63946] transition-all'
          placeholder='Name'
          required
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type='email'
        className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E63946] transition-all'
        placeholder='Email'
        required
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type='password'
        className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E63946] transition-all'
        placeholder='Password'
        required
      />

      <div className='w-full flex justify-between text-sm mt-[-8px] text-gray-600'>
        <p className='cursor-pointer hover:text-[#E63946] transition-colors'>Forgot Password?</p>
        {currentState === 'Login' ? (
          <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer hover:text-[#E63946] transition-colors'>
            Create Account
          </p>
        ) : (
          <p onClick={() => setCurrentState('Login')} className='cursor-pointer hover:text-[#E63946] transition-colors'>
            Login Here
          </p>
        )}
      </div>

      <button
        className='w-full bg-[#E63946] text-white font-semibold px-8 py-3 mt-4 rounded-md shadow-md hover:bg-[#D62839] transition-colors duration-300'
      >
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignIn;
