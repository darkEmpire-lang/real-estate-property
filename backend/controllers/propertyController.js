import { v2 as cloudinary } from "cloudinary";
import Property from "../models/propertyModel.js";
import jwt from "jsonwebtoken";

export const addProperty = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const {
      type,
      description,
      price,
      location,
      contactNumber,
      email,
      availableSlots, // Just get it directly from the body
    } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    const priceNumber = parseFloat(price); // Convert price to a number

    if (isNaN(priceNumber)) {
      return res.json({ success: false, message: "Invalid price value" });
    }

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const propertyData = new Property({
      user: userId,
      type,
      description,
      price: priceNumber,
      location,
      contactNumber,
      email,
      images: imagesUrl,
      availableSlots: availableSlots, // No need to parse
      createdAt: Date.now(),
    });

    await propertyData.save();

    res.json({ success: true, message: "Property added successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error adding property",
        error: error.message,
      });
  }
};


export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find(); // Get all properties from the database
    res.json({ success: true, properties });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching properties",
        error: error.message,
      });
  }
};
export const getUserProperties = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from header

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
    const userId = decoded.id; // Get user ID from the decoded token

    // Find properties by userId
    const properties = await Property.find({ user: userId });

    if (properties.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No properties found for this user" });
    }

    res.json({ success: true, properties });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching user's properties",
        error: error.message,
      });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { id } = req.params; // Property ID from params
    const {
      type,
      description,
      price,
      location,
      contactNumber,
      email,
      availableSlots,
    } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    const priceNumber = parseFloat(price);

    if (isNaN(priceNumber)) {
      return res.json({ success: false, message: "Invalid price value" });
    }

    let imagesUrl = [];
    if (images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        type,
        description,
        price: priceNumber,
        location,
        contactNumber,
        email,
        images: imagesUrl.length > 0 ? imagesUrl : undefined,
        availableSlots,
      },
      { new: true }
    );

    if (!updatedProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, message: "Property updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating property", error: error.message });
  }
};


export const deleteProperty = async (req, res) => {

   try {
      const { id } = req.params;
  
      const property = await Property.findByIdAndDelete(id);
      if (!property) return res.status(404).json({ success: false, message: "Ticket Not Found" });
  
      res.status(200).json({ success: true, message: "Ticket Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }

 
};






export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params; // Get the property ID from the URL parameters

    const property = await Property.findById(id); // Find the property by its ID

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, property });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching property", error: error.message });
  }
};

