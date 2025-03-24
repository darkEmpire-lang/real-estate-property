import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
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
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium relative">
      <Link to="/">
        <img
          src={assets.real}
          className="w-full sm:w-44 md:w-48 max-w-xs mx-auto transform transition-all duration-300 hover:scale-110 object-contain"
          alt="Logo"
        />
      </Link>

      <ul className="hidden sm:flex gap-8 text-sm text-gray-700">
        <NavLink to="/" className="hover:text-blue-600 transition-all duration-300">Home</NavLink>
        <NavLink to="/collection" className="hover:text-blue-600 transition-all duration-300">Collection</NavLink>
        <NavLink to="/about" className="hover:text-blue-600 transition-all duration-300">About</NavLink>
        <NavLink to="/contact" className="hover:text-blue-600 transition-all duration-300">Contact</NavLink>
        
        {/* Services Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setServicesDropdown(true)}
          onMouseLeave={() => setServicesDropdown(false)}
        >
          <p className="cursor-pointer hover:text-blue-600 transition-all duration-300">Services</p>
          {servicesDropdown && (
            <div className="absolute left-0 mt-1 w-40 bg-white shadow-md rounded-md text-gray-700">
              <NavLink to="/raise-ticket" className="block px-4 py-2 hover:bg-blue-100">Raise Ticket</NavLink>
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
        
        <div className="relative group">
          <Link to="/login">
            <img
              src={assets.profile_icon}
              className="w-5 cursor-pointer transition-all duration-300 hover:scale-110"
              alt="Profile Icon"
            />
          </Link>
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
              </div>
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
