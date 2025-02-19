import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { token, user, setUser, backEndURL, fetchUserProfile, logout } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        toast.error("⚠️ Please log in to view your profile.");
        setLoading(false);
        return;
      }

      if (!user) {
        await fetchUserProfile(); // Fetch profile using context function
      }

      setLoading(false); // Loading ends whether user is fetched or not
    };

    loadProfile();
  }, [token, user, fetchUserProfile]);

  if (loading) return <p className="text-center mt-20 text-lg">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Your Profile</h2>

      {user ? (
        <>
          <div className="space-y-4 text-gray-700">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
          </div>
          <button
            onClick={logout}
            className="w-full mt-8 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
          >
            Logout
          </button>
        </>
      ) : (
        <p className="text-center text-red-500">⚠️ User not found.</p>
      )}
    </div>
  );
};

export default Profile;
