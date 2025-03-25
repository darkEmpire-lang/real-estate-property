import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/properties");
        setProperties(response.data.properties);
      } catch (error) {
        console.error("Error fetching properties", error);
        toast.error("Error fetching properties");
      }
    };

    fetchAllProperties();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        All Available Properties
      </h2>
      {properties.length === 0 ? (
        <p className="text-center text-gray-600">No properties available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              <img
                src={property.images[0]}
                alt="Property"
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800">{property.type}</h3>
                <p className="text-gray-600 mt-2">{property.description}</p>
                <p className="text-gray-700 mt-2 font-medium">{property.location}</p>
                <p className="text-xl font-bold text-gray-900 mt-2">${property.price}</p>
                <button
                  onClick={() => window.location.href = `/book-appointment/${property._id}`}
                  className="mt-4 w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition duration-300"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
