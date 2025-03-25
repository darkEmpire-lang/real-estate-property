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
    const profilePic = req.file ? req.file.path : ""; // Cloudinary image URL

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    // Validate password
    if (password.length < 5) {
      return res.json({ success: false, message: "Weak password" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });

    const savedUser = await newUser.save();
    const token = createToken(savedUser._id);

    res.json({
      success: true,
      message: "Registration successful!",
      token,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
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

const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.params.id;
    let profilePic = req.file ? req.file.path : undefined;

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Hash new password if provided
    let updatedPassword = user.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, salt);
    }

    // Update user data
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = updatedPassword;
    user.profilePic = profilePic || user.profilePic;

    await user.save();

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};









export { loginUser, registerUser, adminlogin,updateUser,deleteUser };
