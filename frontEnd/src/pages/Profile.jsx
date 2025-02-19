import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setUserData(response.data.user);
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='mt-20 text-lg font-bold text-black'>
            <h1>Profile</h1>
            {userData && (
                <div>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    {/* Add more user details here if needed */}
                </div>
            )}
        </div>
    );
};

export default Profile;