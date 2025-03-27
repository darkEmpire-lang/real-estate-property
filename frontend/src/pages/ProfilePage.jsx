import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserPropList from "./UserPropList";
import { FiEdit, FiTrash2, FiLogOut } from "react-icons/fi";

const ProfilePage = () => {
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [totalListings, setTotalListings] = useState(0); // New state for total listings
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = token || localStorage.getItem("token");
    if (!savedToken) return navigate("/login");

    axios
      .get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
      .then((res) => {
        if (res.data.success) setUser(res.data.user);
        else toast.error("Failed to fetch profile");
      })
      .catch(() => toast.error("Error fetching profile"))
      .finally(() => setLoading(false));
  }, [token, backendUrl, navigate]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-6 py-10 w-full">
      <div className="w-full max-w-6xl bg-white rounded-lg p-8 flex flex-col lg:flex-row relative shadow-md">
        {/* Left Sidebar - Profile Section */}
        <div className="w-full lg:w-1/3 p-6 border-r">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Agent Details</h2>

          {/* Profile Picture & Toggle Menu */}
          <div className="relative flex flex-col items-center">
            <img
              src={user.profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-gray-300 object-cover cursor-pointer shadow-md hover:scale-105 transition"
              onClick={() => setShowMenu(!showMenu)}
            />

            {/* Hidden Menu - Shows when clicking the image */}
            {showMenu && (
              <div className="absolute top-32 w-48 bg-white shadow-lg rounded-md text-center p-3 transition-all border">
                <h2 className="text-lg font-bold">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>

                <div className="mt-4 flex flex-col gap-2">
                  <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition">
                    <FiEdit /> Edit Profile
                  </button>
                  <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition">
                    <FiTrash2 /> Delete Account
                  </button>
                  <button
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-700 transition"
                    onClick={handleLogout}
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Active Listings & Dashboard */}
        <div className="w-full lg:w-2/3 p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Active Listings</h2>

          {/* User Properties List Component */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <UserPropList setTotalListings={setTotalListings} />
          </div>

          {/* Dashboard Features */}
          <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white shadow-md p-6 rounded-md text-center">
                <h3 className="text-2xl font-bold text-blue-500">{totalListings}</h3>
                <p className="text-gray-600">Total Listings</p>
              </div>

              <div className="bg-white shadow-md p-6 rounded-md text-center">
                <h3 className="text-2xl font-bold text-yellow-500">{user.pendingRequests || 0}</h3>
                <p className="text-gray-600">Pending Requests</p>
              </div>

              <div className="bg-white shadow-md p-6 rounded-md text-center">
                <h3 className="text-2xl font-bold text-green-500">{user.soldListings || 0}</h3>
                <p className="text-gray-600">Sold Properties</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
