import express from 'express'
import { loginUser,registerUser,adminlogin,updateUser,deleteUser } from '../controllers/userController.js'
import upload from '../middleware/multer.js';
const userRouter=express.Router();


userRouter.post('/register',upload.single("profilePic"),registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminlogin)
userRouter.put("/update/:id", upload.single("profilePic"), updateUser); // Update user profile
userRouter.delete("/delete/:id", deleteUser); // Delete user



export default userRouter;