import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Apartment");
  const [subCategory, setSubCategory] = useState("Colombo");
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onsubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subcategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Property added successfully!");
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the property.");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9')",
      }}
    >
      <form
        onSubmit={onsubmitHandler}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-2xl flex flex-col gap-5"
      >
        {/* Upload Images Section */}
        <div>
          <p className="mb-3 text-white font-medium text-lg">
            Upload Property Images
          </p>
          <div className="flex gap-3">
            {[setImage1, setImage2, setImage3, setImage4].map(
              (setImage, index) => (
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
                        : URL.createObjectURL(
                            [image1, image2, image3, image4][index]
                          )
                    }
                    alt="Upload Placeholder"
                  />
                  <input
                    type="file"
                    id={`image${index + 1}`}
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
              )
            )}
          </div>
        </div>

        {/* Product Name */}
        <div>
          <p className="text-white font-medium">Property Name</p>
          <input
            className="w-full bg-black/30 border-none rounded-md px-4 py-2 text-white placeholder-white focus:ring-2 focus:ring-pink-300"
            type="text"
            placeholder="Enter property name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Product Description */}
        <div>
          <p className="text-white font-medium">Property Description</p>
          <textarea
            className="w-full bg-black/30 border-none rounded-md px-4 py-2 text-white placeholder-white focus:ring-2 focus:ring-pink-300"
            placeholder="Write property description here"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Category, Location, and Price */}
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1">
            <p className="text-white font-medium">Property Type</p>
            <select
              className="w-full bg-black/30 border-none rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-pink-300"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Commercial">Commercial</option>
              <option value="Land">Land</option>
              <option value="Luxury Villa">Luxury Villa</option>
              <option value="Modern Apartment">Modern Apartment</option>
              <option value="Penthouse Suite">Penthouse Suite</option>
              <option value="Beachfront Home">Beachfront Home</option>
              <option value="Countryside Retreat">Countryside Retreat</option>
              <option value="Commercial Property">Commercial Property</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Studio Apartment">Studio Apartment</option>
              <option value="Gated Community Home">Gated Community Home</option>
              <option value="Resort-Style Condo">Resort-Style Condo</option>
            </select>
          </div>

          <div className="flex-1">
            <p className="text-white font-medium">Location</p>
            <select
              className="w-full bg-black/30 border-none rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-pink-300"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              required
            >
              <option value="Colombo">Colombo</option>
              <option value="Kandy">Kandy</option>
              <option value="Galle">Galle</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
              <option value="Negombo">Negombo</option>
              
            </select>
          </div>

          <div className="flex-1">
            <p className="text-white font-medium">Property Price</p>
            <input
              className="w-full bg-black/30 border-none rounded-md px-4 py-2 text-white placeholder-white focus:ring-2 focus:ring-pink-300"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="text-white font-medium">Square Feet</p>
          <div className="flex gap-3">
            {["1334x4456", "2344x54433", "4445x5666", "Custom"].map((size) => (
              <div
                key={size}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size)
                      ? prev.filter((item) => item !== size)
                      : [...prev, size]
                  )
                }
                className={`${
                  sizes.includes(size)
                    ? "bg-pink-400 text-white"
                    : "bg-white/30 text-white"
                } px-3 py-1 cursor-pointer rounded-md`}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div>
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={() => setBestSeller((prev) => !prev)}
          />
          <label htmlFor="bestseller" className="ml-2 text-white">
            Featured Listing
          </label>
        </div>

        {/* Submit Button */}
        <button className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-all">
          Add Property
        </button>
      </form>
    </div>
  );
};

export default Add;
