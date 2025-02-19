import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const Profile = () => {
  const { user } = useContext(ShopContext);

  if (!user) {
    return <div>Loading...</div>; // Handle case where user data is not available
  }

  return (
    <div className='mt-20 text-lg font-bold text-black'>
      <h1>Profile</h1>
      <div className='mt-40'>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
};

export default Profile;