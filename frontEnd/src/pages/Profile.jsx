import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const { token, user, setUser, backEndURL, fetchUserProfile, logout } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(user?.verificationStatus || "Not Submitted");

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        toast.error("⚠️ Please log in to view your profile.");
        setLoading(false);
        return;
      }

      if (!user) {
        await fetchUserProfile();
      }

      setVerificationStatus(user?.verificationStatus || "Not Submitted");
      setLoading(false);
    };

    loadProfile();
  }, [token, user, fetchUserProfile]);

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const uploadDocument = async () => {
    if (!document) {
      toast.error("Please select a document.");
      return;
    }

    const formData = new FormData();
    formData.append("document", document);

    try {
      const response = await axios.post(`${backEndURL}/upload-verification`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      toast.success("Document uploaded successfully! Verification in progress.");
      setVerificationStatus("Pending");
    } catch (error) {
      toast.error("Failed to upload document.");
    }
  };

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

          {/* Verification Section */}
          <div className="mt-6 p-4 border rounded-lg bg-gray-100">
            <h3 className="text-lg font-semibold">Identity Verification</h3>
            <p>Status: <strong className="text-blue-600">{verificationStatus}</strong></p>

            {verificationStatus === "Not Submitted" || verificationStatus === "Rejected" ? (
              <>
                <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange} className="mt-3" />
                <button
                  onClick={uploadDocument}
                  className="w-full mt-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
                >
                  Upload Document
                </button>
              </>
            ) : verificationStatus === "Pending" ? (
              <p className="text-yellow-600">Your document is under review.</p>
            ) : (
              <p className="text-green-600">✅ Verified</p>
            )}
          </div>

          <button onClick={logout} className="w-full mt-8 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
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
