import express from "express";
import multer from "multer";
import  authUser from "../middleware/auth.js";  // Authentication middleware
import { addProperty,getAllProperties,getUserProperties,updateProperty, deleteProperty,getPropertyById} from "../controllers/propertyController.js";


const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Route to add property
router.post("/add", authUser, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProperty); 


// router.get("/", getProperties);  // Get all properties

router.get('/', getAllProperties);  // Get all properties
router.get('/user', authUser, getUserProperties); 

router.put('/:id', upload.fields([{ name: "image1" }, { name: "image2" }, { name: "image3" }, { name: "image4" }]), updateProperty);

router.get("/:id", getPropertyById);  // Fetch a property by its ID


router.delete('/:id', authUser,deleteProperty);







export default router;
