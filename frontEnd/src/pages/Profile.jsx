import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { token, backEndURL } = useContext(ShopContext); // Get token from context
  const [user, setUser] = useState(null); // Store user data

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${backEndURL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          toast.error("Failed to load profile");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching profile data");
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token, backEndURL]);

  return (
    <div className="mt-20 p-6 bg-white shadow-md rounded-lg max-w-md mx-auto text-gray-800">
      <h2 className="text-2xl font-semibold text-center mb-4">Profile</h2>
      
      {user ? (
        <div className="space-y-4">
          <p><span className="font-bold">Name:</span> {user.name}</p>
          <p><span className="font-bold">Email:</span> {user.email}</p>
          <p><span className="font-bold">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
