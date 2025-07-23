import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { sendToken } from "../utils/jwt";

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

export const logoutUser=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    res.cookie("accessToken","",{maxAge:1});
    res.cookie("refreshToken","",{maxAge:1});

    res.status(200).json({
      message:"Logout done",
      success:true
    })
})


///-------------------------------------------
