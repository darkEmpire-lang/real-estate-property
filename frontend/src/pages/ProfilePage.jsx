import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve token from localStorage if not available in context
    const savedToken = token || localStorage.getItem('token');
    if (!savedToken) return navigate('/login');

    axios
      .get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
      .then((res) => {
        if (res.data.success) setUser(res.data.user);
        else toast.error('Failed to fetch profile');
      })
      .catch(() => toast.error('Error fetching profile'))
      .finally(() => setLoading(false));
  }, [token, backendUrl, navigate]);

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token'); // Clear token from storage
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {loading ? (
        <div className="text-2xl font-semibold">Loading...</div>
      ) : (
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-xl shadow-xl text-center w-96 mb-80 ">
          <div className="flex flex-col items-center">
            <img
              src={user.profilePic || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
            <p className="text-bakck text-sm">{user.email}</p>
          </div>

          <button
            className="mt-6 bg-red-600 hover:bg-red-700 transition-all py-2 px-5 rounded-lg font-semibold w-full shadow-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
