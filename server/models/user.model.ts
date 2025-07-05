import mongoose, { Document, Schema, Model } from "mongoose";
import argon2 from "argon2";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerfied: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken:()=> string;
  SignRefreshToken:()=> string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      validate: {
        validator: (value: string): boolean => emailRegexPattern.test(value),
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      // minlength: [8, "Password should be at least 8 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

// Hashing password before saving to the database
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await argon2.hash(this.password);
  next();
});

//-----------------Access token----------------
userSchema.methods.SignAccessToken = function(){
  return jwt.sign({id:this._id},process.env.ACCESS_TOKEN_SECRET || "" as string);
}
userSchema.methods.SignRefreshToken = function(){
  return jwt.sign({id:this._id},process.env.REFRESH_TOKEN_SECRET || "" as string);
}


// Compare password method
userSchema.methods.comparePassword = async function (
  enteredpassword: string
): Promise<boolean> {
  return await argon2.verify(this.password, enteredpassword);
};
// Create the User model
const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default userModel;

