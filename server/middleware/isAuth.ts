import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload }  from 'jsonwebtoken';
import { redis } from "../utils/redis";


//? ----------------- isAuth Middleware -----------------

export const isAuth = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  const accessToken = req.cookies.accessToken;
  if(!accessToken){
    return next(new ErrorHandler("Please login",400));
  }
  const decoded = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload

  if(!decoded){
    return next(new ErrorHandler("accessToken not valid",400));
  }
  const user = await redis.get(decoded.id);
  if(!user){
    return next(new ErrorHandler("user not found" , 400));
  }

  req.user = JSON.parse(user);
  next();
})


// Validate User Role

export const ValidateUserRole = (...roles:string[])=>{
  return (req:Request , res:Response , next:NextFunction)=>{
    if(!roles.includes(req.user?.role || '')){
        return next (new ErrorHandler(`Role ${req.user?.role} is not allowed` , 403))
    }
    next();
  }
}