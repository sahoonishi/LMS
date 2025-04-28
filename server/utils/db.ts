import mongoose from "mongoose";
import dotenv from "dotenv";
const dbURL: string = process.env.MONGO_URI || "";
const connectDB = async () => {
  try {
    await mongoose.connect(dbURL).then((data: any) => {
      console.log(`MongoDB connected at ${data.connection.host}`);
    });
  } catch (error) {
    console.log(error);
    setTimeout(connectDB, 5000);
  }
};
export default connectDB;
