import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen bg-gradient-to-b from-[#1a1f36] to-[#2d3748] shadow-lg border-r border-gray-700 text-white">
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-600">
        <img className="w-10 h-10" src={assets.real} alt="Logo" />
        <h2 className="text-lg font-bold tracking-wide">Real Estate Hub</h2>
      </div>

      {/* Sidebar Menu */}
      <div className="flex flex-col gap-4 pt-6 pl-6 text-[15px]">
        {/* Add Property */}
        <NavLink
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#374151] transition-all"
          to="/add"
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="Add Icon" />
          <p className="hidden md:block font-medium">Add Property</p>
        </NavLink>
        <hr className="border-t border-gray-600" />

        {/* List Properties */}
        <NavLink
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#374151] transition-all"
          to="/list"
        >
          <img className="w-5 h-5" src={assets.list_icon} alt="List Icon" />
          <p className="hidden md:block font-medium">List Properties</p>
        </NavLink>
        <hr className="border-t border-gray-600" />

        {/* Charts Section */}
        <NavLink
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#374151] transition-all"
          to="/charts"
        >
          <img className="w-5 h-5" src={assets.chart} alt="Charts Icon" />
          <p className="hidden md:block font-medium">Market Trends</p>
        </NavLink>

        {/* Reports Section */}
        <NavLink
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#374151] transition-all"
          to="/reports"
        >
          <img className="w-5 h-5" src={assets.report} alt="Reports Icon" />
          <p className="hidden md:block font-medium">Reports</p>
        </NavLink>

        {/* Agents Section */}
        <NavLink
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#374151] transition-all"
          to="/adminticket"
        >
          <img className="w-5 h-5" src={assets.ag} alt="Agents Icon" />
          <p className="hidden md:block font-medium">Raised Tickets</p>
        </NavLink>

        {/* Logout Button */}
       
      </div>
    </div>
  );
};

export default Sidebar;
