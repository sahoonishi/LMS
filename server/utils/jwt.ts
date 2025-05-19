import dotenv from "dotenv";
import {Response} from "express";
import { IUser } from "../models/user.model";
dotenv.config();

interface ITokenOptions{
  expires:Date;
  maxAge: number;
  httpOnly:boolean;
  sameSite: 'lax' | 'strict' | 'none' | undefined;
  secure?:boolean;
}

const sendToken=(user:IUser,statusCode:number,res:Response)=>{
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  //! UPLOAD SESSION TO REDIS


  //!parse enviroment variables 

  const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300",10);
  const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200",10);

  //! options for cookies

  const accessTokenOptions:ITokenOptions = {
    expires:new Date (Date.now()+accessTokenExpire*1000),
    maxAge:accessTokenExpire * 1000,
    httpOnly:true,
    sameSite:"lax",
  } 
    const refreshTokenOptions:ITokenOptions = {
    expires:new Date (Date.now()+refreshTokenExpire*1000),
    maxAge:refreshTokenExpire * 1000,
    httpOnly:true,
    sameSite:"lax",
  } 

  //! only set secure true in producton


}