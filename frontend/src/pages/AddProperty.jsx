import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUpload } from "react-icons/fa";
import { assets } from "../../../admin/src/assets/assets";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const AddProperty = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [availableslots, setAvailableSlots] = useState([]);
  const [properties, setProperties] = useState([]);

  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");

  // Initialize useNavigate hook
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing properties from the server
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/properties/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setProperties(response.data.properties);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching properties.");
      }
    };

    fetchProperties();
  }, [token]);

  // Time slot selection handler
  const handleSlotSelection = (e) => {
    const selectedSlots = Array.from(e.target.selectedOptions, (option) => option.value);
    setAvailableSlots(selectedSlots);
  };

  // Submit handler
  const onsubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Authorization token is missing.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("location", location);
      formData.append("contactNumber", contactNumber);
      formData.append("email", email);
      formData.append("availableslots", JSON.stringify(availableslots));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(
        `http://localhost:4000/api/properties/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Ensure token is included
          },
        }
      );

      if (response.data.success) {
        toast.success("Property added successfully!");
        // Re-fetch the properties list after successful addition
        const fetchProperties = async () => {
          try {
            const response = await axios.get("http://localhost:4000/api/properties/user", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.data.success) {
              setProperties(response.data.properties);
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            console.error(error);
            toast.error("An error occurred while fetching properties.");
          }
        };
        fetchProperties();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the property.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row p-6 gap-6 bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9')",
      }}
    >
      {/* Add Property Form */}
      <div className="w-full lg:w-1/2 bg-white/20 backdrop-blur-lg p-8 rounded-lg shadow-lg">
        <h2 className="text-white text-2xl font-semibold text-center mb-5">Add Property</h2>

        <form onSubmit={onsubmitHandler} className="flex flex-col gap-5">
          <div>
            <p className="mb-3 text-white font-medium text-lg">Upload Property Images</p>
            <div className="flex gap-3">
              {[setImage1, setImage2, setImage3, setImage4].map((setImage, index) => (
                <label
                  key={index}
                  htmlFor={`image${index + 1}`}
                  className="cursor-pointer border border-gray-300 rounded-md p-2 bg-white/50 hover:bg-white transition-all"
                >
                  <img
                    className="w-16 h-16 object-cover"
                    src={
                      ![image1, image2, image3, image4][index]
                        ? assets.upload_area
                        : URL.createObjectURL([image1, image2, image3, image4][index])
                    }
                    alt="Upload Placeholder"
                  />
                  <input
                    type="file"
                    id={`image${index + 1}`}
                    hidden
                    onChange={(e) => [setImage1, setImage2, setImage3, setImage4][index](e.target.files[0])}
                  />
                </label>
              ))}
            </div>
          </div>

          <input
            className="input"
            type="text"
            placeholder="Property Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
          <textarea
            className="input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <input
            className="input"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            className="input"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            className="input"
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
          <label className="text-white font-medium">Available Time Slots</label>
          <div className="flex gap-3">
            {["4-6pm", "2-5pm", "10-12pm", "Custom"].map((slot) => (
              <div
                key={slot}
                onClick={() =>
                  setAvailableSlots((prev) =>
                    prev.includes(slot) ? prev.filter((item) => item !== slot) : [...prev, slot]
                  )
                }
                className={`${
                  availableslots.includes(slot) ? "bg-pink-400 text-white" : "bg-white/30 text-white"
                } px-3 py-1 cursor-pointer rounded-md`}
              >
                {slot}
              </div>
            ))}
          </div>

          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-all">
            Add to Listing
          </button>
        </form>
      </div>

      {/* User's Property Listings */}
      <div className="w-full lg:w-1/2 bg-white/20 backdrop-blur-lg p-8 rounded-lg shadow-lg overflow-auto">
        <h2 className="text-white text-2xl font-semibold text-center mb-5">My Property Listings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all">
              <img
                src={property.images[0]}
                alt="Property"
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">{property.type}</h3>
              <p className="text-gray-600">{property.description.slice(0, 50)}...</p>
              <p className="text-gray-800 mt-2">Price: ${property.price}</p>
              <p className="text-gray-800">Location: {property.location}</p>
              <button
                onClick={() => navigate(`/property/${property.id}`)}
                className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
