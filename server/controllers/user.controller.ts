import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import { getAllUsers, getUserinfo } from "../services/user.service";
import cloudinary from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register a new user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body as IRegistrationBody;
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    const user: IRegistrationBody = {
      name,
      email,
      password,
    };
    const { activationCode, token } = createActivationToken(user);
    const data = { user: { name: user.name }, activationCode };
    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activation-mail.ejs"),
      data
    );
    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account`,
        activationToken: token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
interface IActivationToken {
  token: string;
  activationCode: string;
}

const createActivationToken = (user: IRegistrationBody): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );
  return { token, activationCode };
};

// -----------------------------------ACTIVATE USER-----------------------------------
interface IActivationRequest {
  activationToken: string;
  activationCode: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activationToken, activationCode } = req.body as IActivationRequest;
    if (!activationToken) {
      return next(new ErrorHandler("Please provide activation token", 400));
    }
    const decodedData = jwt.verify(
      activationToken,
      process.env.ACTIVATION_SECRET as Secret
    ) as { user: IUser; activationCode: string };

    if (decodedData.activationCode !== activationCode) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password } = decodedData.user;
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return next(new ErrorHandler("User already exists", 400));
    }
    const newUser = await userModel.create({
      name,
      email,
      password,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  }
);

// ----------------------------------------LOGINUSER----------------------------------------

interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as ILoginRequest;
    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password", 400));
    }
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("No user found", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendToken(user, 200, res);
  }
);

//!-------------------LOGOUT USER---------------

export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("accessToken", "", { maxAge: 1 });
    res.cookie("refreshToken", "", { maxAge: 1 });
    const userId = req.user?._id || "";
    redis.del(String(userId));

    res.status(200).json({
      message: "Logout done",
      success: true,
    });
  }
);

// Update Access token

export const UpdateAccesstoken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.cookies.refreshToken as string;
    const decoded = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("Could not refresh token", 400));
    }
    const session = await redis.getex(decoded?.id as string, "EX", 604800);

    if (!session) {
      return next(new ErrorHandler("Please login to access this resource", 400));
    }
    const user = JSON.parse(session);
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "5m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "3d" }
    );

    req.user = user;
    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);

    // await redis.set(user._id,JSON.stringify(user),"EX",604800); // expire after 7 days (604800 is seconds)

    res.status(200).json({
      success: true,
      accessToken,
    });
  }
);

// GET USER INFO

export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id as string;
    getUserinfo(userId, res);
  }
);

// SOCIAL AUTH

interface ISocial {
  email: string;
  name: string;
  avatar: string;
}

export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, avatar } = req.body as ISocial;
    const user = await userModel.findOne({ email });
    if (!user) {
      const newUser = await userModel.create({ email, name, avatar });
      sendToken(newUser, 200, res);
    } else {
      sendToken(user, 200, res);
    }
  }
);

//UPDATE USER INFO

interface IUpdate {
  name: string;
  email: string;
}

export const updateInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = req.body as IUpdate;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (email && user) {
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      user.email = email;
    }
    if (name && user) {
      user.name = name;
    }
    await user?.save();
    await redis.set(String(userId), JSON.stringify(user));

    res.status(201).json({
      message: "User info updated",
      success: true,
      user,
    });
  }
);

// UPDATE PASSWORD

interface IPassword {
  oldpassword: string;
  newpassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldpassword, newpassword } = req.body as IPassword;
    if (!oldpassword || !newpassword) {
      return next(new ErrorHandler("Enter old and new password", 400));
    }
    const user = await userModel.findById(req?.user?._id).select("+password");
    const isPasswordMatch = await user?.comparePassword(oldpassword);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Password wont match", 400));
    }
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    user.password = newpassword;
    await user.save();
    await redis.set(String(user?._id), JSON.stringify(user));
    res.status(201).json({
      success: true,
      message: "Password updated",
      user,
    });
  }
);

// UPDATE PROFILE PIC

interface IAvatar {
  avatar: string;
}

export const updateProfilepic = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { avatar } = req.body as IAvatar;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);
    if (avatar && user) {
      if (user?.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "LMSavatars",
          width: 150,
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "LMSavatars",
          width: 150,
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    }

    await user?.save();
    await redis.set(String(userId), JSON.stringify(user));
    res.status(200).json({ 
      success: true,
      message:"Profilepic updated",
      user,
    });
  }
);

// get all users
export const getAllusers = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  getAllUsers(res);
})

// update user role --only admin
export const updateUserRole=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  const {id,role}=req.body;
  const user = await userModel.findByIdAndUpdate(id,{role},{new:true});
  res.status(200).json({
    success:true,
    user,
    message:"user updated successfully"
  })
})
// delete user --only admin
export const deleteUser=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  const {id}=req.params;
  const user = await userModel.findById(id);
  if(!user){
    return next(new ErrorHandler("User not found",404))
  }
  await user.deleteOne();
  await redis.del(id);
  return res.status(200).json({
    success:true,
    message:"User deleted"
  })
})