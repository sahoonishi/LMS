import { app } from "./app";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";
import connectDB from "./utils/db";
dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})



app.listen(process.env.PORT,()=>{
  console.log(`Server connected at ${process.env.PORT}`)
  connectDB();
})
