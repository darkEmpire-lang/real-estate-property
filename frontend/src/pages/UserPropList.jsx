import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserPropList = ({ setTotalListings }) => {
  const [properties, setProperties] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        if (!token) {
          toast.error("You are not logged in!");
          return;
        }

        const response = await axios.get("http://localhost:4000/api/properties/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setProperties(response.data.properties);
          setTotalListings(response.data.properties.length); // Update total listing count
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Error fetching properties");
      }
    };

    fetchUserProperties();
  }, [token, setTotalListings]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.length === 0 ? (
        <p className="text-center text-gray-600">No properties found.</p>
      ) : (
        properties.map((property) => (
          <div key={property._id} className="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105">
            <img src={property.images[0]} alt="Property" className="w-full h-52 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold">{property.type}</h3>
              <p className="text-gray-600">{property.description}</p>
              <p className="text-gray-900 font-bold">${property.price}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserPropList;
