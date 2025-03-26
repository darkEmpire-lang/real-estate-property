import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import deliveryofficer from "../models/deliveryofficer.js";
import { v2 as cloudinary } from 'cloudinary';

// Function to create a JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

// User login handler
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // Create a token and respond with user details
    const token = createToken(user._id);
    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// User registration handler
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let profilePic = "";

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Validate password
    if (password.length < 5) {
      return res.status(400).json({ success: false, message: "Password too short (min 5 chars)" });
    }

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        console.log("Uploading image to Cloudinary:", req.file.path); // Debug log
        const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
          folder: "user_profiles",
        });
        profilePic = uploadedResponse.secure_url; // Cloudinary URL
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.json({ success: false, message: "Image upload failed" });
      }
    } else {
      console.warn("No file uploaded! req.file is undefined.");
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to DB
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });

    await newUser.save();
    const token = createToken(newUser._id);

    res.status(201).json({ success: true, message: "Registration successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.params.id;
    let profilePic;

    // Find user
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Upload new profile pic to Cloudinary if provided
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload_stream(
        { folder: "user_profiles" },
        (error, result) => {
          if (error) throw error;
          profilePic = result.secure_url;
        }
      ).end(req.file.buffer);
    }

    // Hash new password if provided
    let updatedPassword = user.password;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    // Update user data
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = updatedPassword;
    user.profilePic = profilePic || user.profilePic;

    await user.save();
    res.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





// Admin login handler
const adminlogin = async (req, res) => {
  try {
    const { email,password } = req.body;

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

        const token =jwt.sign(email+password,process.env.JWT_SECRET)
        res.json({success:true,token})
    }
    else{

        res.json({success:false,message:"invalid credentials"})
    }
    
   
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }

};


const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};









export { loginUser, registerUser, adminlogin,updateUser,deleteUser,getUserProfile,verifyToken };
