import { Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";

export const getUserinfo = async(id:string , res:Response)=>{
    const userJson = await redis.get(id);
    if(userJson){
        const user = JSON.parse(userJson);
        res.status(201).json({
            message:"User Info fetched",
            success:true,
            user
        })
    }
}