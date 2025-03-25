import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import {
  User,
  CalendarCheck,
  MessageSquare,
  LifeBuoy,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false); // Dropdown state
  const [pendingCount, setPendingCount] = useState(0);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setcartItems,
  } = useContext(ShopContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setcartItems({});
    navigate("/login");
    setProfileDropdown(false); // Close dropdown on logout
  };

  // Fetch pending ticket count
  useEffect(() => {
    const fetchPendingTickets = async () => {
      try {
        if (!token) return;
        const response = await axios.get(
          "http://localhost:4000/api/tickets/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const pendingTickets = response.data.tickets.filter(
          (ticket) => ticket.replies.length === 0
        );
        setPendingCount(pendingTickets.length);
      } catch (error) {
        console.error("Error fetching pending tickets:", error);
        setPendingCount(0);
      }
    };

    fetchPendingTickets();
    const interval = setInterval(fetchPendingTickets, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <div className="flex items-center justify-between py-5 font-extrabold relative">
      <Link to="/">
        <img
          src={assets.gewal}
          className="w-full sm:w-44 md:w-48 max-w-xs mx-auto transform transition-all duration-300 hover:scale-110 object-contain"
          alt="Logo"
        />
      </Link>

      <ul className="hidden sm:flex gap-8 text-sm text-gray-700">
        <NavLink
          to="/"
          className="hover:text-blue-600 transition-all duration-300"
        >
          Home
        </NavLink>
        <NavLink
          to="/collection"
          className="hover:text-blue-600 transition-all duration-300"
        >
          Collection
        </NavLink>
        <NavLink
          to="/about"
          className="hover:text-blue-600 transition-all duration-300"
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className="hover:text-blue-600 transition-all duration-300"
        >
          Contact
        </NavLink>
        <NavLink
          to="/feedbacks"
          className="hover:text-blue-600 transition-all duration-300"
        >
          Feedbacks
        </NavLink>

        {/* Services Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setServicesDropdown(true)}
          onMouseLeave={() => setServicesDropdown(false)}
        >
          <p className="cursor-pointer hover:text-blue-600 transition-all duration-300">
            Services
          </p>
          {servicesDropdown && (
            <div className="absolute left-0 mt-1 w-40 bg-white shadow-md rounded-md text-gray-700">
              <NavLink
                to="/raise-ticket"
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Raise Ticket
              </NavLink>
            </div>
          )}
        </div>
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer transition-all duration-300 hover:scale-110"
          alt="Search Icon"
        />

        {/* View Tickets Icon with Pending Count */}
        {token && (
          <Link to="/my-tickets" className="relative">
            <img
              src={assets.tic}
              className="w-6 cursor-pointer transition-all duration-300 hover:scale-110"
              alt="View Tickets Icon"
            />
            {pendingCount > 0 && (
              <span className="absolute top-[-5px] right-[-5px] w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded-full">
                {pendingCount}
              </span>
            )}
          </Link>
        )}

        {/* Profile Dropdown */}
        <div className="relative profile-dropdown">
          <img
            src={assets.profile_icon}
            className="w-5 cursor-pointer transition-all duration-300 hover:scale-110"
            alt="Profile Icon"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering closeDropdown on click
              setProfileDropdown(!profileDropdown);
            }}
          />

          {profileDropdown && (
            <div className="absolute right-0 mt-3 w-44 bg-white shadow-md rounded-md p-3 text-gray-700">
              <p
                onClick={() => {
                  navigate("/profile");
                  setProfileDropdown(false);
                }}
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md flex items-center gap-2"
              >
                <User className="w-4 h-4 text-gray-600" /> My Profile
              </p>

              <p
                onClick={() => {
                  navigate("/orders");
                  setProfileDropdown(false);
                }}
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-gray-600" /> My Bookings
              </p>

              <p
                onClick={() => {
                  navigate("/submit-feedbacks");
                  setProfileDropdown(false);
                }}
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-gray-600" /> Add A
                Feedback
              </p>

              <p
                onClick={() => {
                  navigate("/raise-ticket");
                  setProfileDropdown(false);
                }}
                className="cursor-pointer p-2 hover:bg-blue-100 rounded-md flex items-center gap-2"
              >
                <LifeBuoy className="w-4 h-4 text-gray-600" /> Raise A Ticket
              </p>

              <p
                onClick={logout}
                className="cursor-pointer p-2 text-red-500 hover:bg-red-100 rounded-md flex items-center gap-2"
              >
                <LogOut className="w-4 h-4 text-red-500" /> Logout
              </p>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img
            src={assets.cart_icon}
            className="w-5 cursor-pointer transition-all duration-300 hover:scale-110"
            alt="Cart Icon"
          />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden transition-all duration-300 hover:scale-110"
          alt="Menu Icon"
        />
      </div>
    </div>
  );
};

export default Navbar;
