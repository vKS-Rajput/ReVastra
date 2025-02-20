import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const IdVerification = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingVerifications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get('/api/admin/pending-verifications', {
        headers: { token },
      });
      setUsers(data.users);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch verifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (userId, action) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/admin/${action}/${userId}`, {}, {
        headers: { token },
      });
      toast.success(`Verification ${action}ed successfully.`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed.");
    }
  };

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  if (loading) return <p className="text-center mt-20 text-lg">Loading verifications...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-semibold text-center mb-8">Pending Verifications</h2>
      {users.length === 0 ? (
        <p className="text-center text-gray-500">No pending verifications.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map(user => (
            <Card key={user._id} className="p-4 shadow-lg rounded-2xl">
              <CardContent>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Status:</strong> {user.verificationStatus}</p>
                <div className="my-4">
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL}/${user.verificationDocument}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Document
                  </a>
                </div>
                <div className="flex gap-4 mt-4">
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleVerification(user._id, 'approve')}
                  >
                    Approve
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleVerification(user._id, 'reject')}
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdVerification;
