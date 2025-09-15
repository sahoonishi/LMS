import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import userModel from "../models/user.model";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

export const getUserAnalytics=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const userAnalytics = await generateLast12MonthsData(userModel);
    res.status(200).json({
        message:"All user got",
        userAnalytics,
        success:true
    })
})
export const getCourseAnalytics=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const courseAnalytics = await generateLast12MonthsData(CourseModel);
    res.status(200).json({
        message:"All course got",
        courseAnalytics,
        success:true
    })
})
export const getOrderAnalytics=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const orderAnalytics = await generateLast12MonthsData(OrderModel);
    res.status(200).json({
        message:"All course got",
        orderAnalytics,
        success:true
    })
})