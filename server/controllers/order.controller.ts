import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.model";
import { newOrder } from "../services/order.service";

export const createOrder=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const {courseId,payment_info} = req.body as IOrder;
    const user = await userModel.findById(req.user?.id);
    const courseExist = user?.courses.some((item:any)=>item?._id.equals(courseId));
    if(courseExist){
        return next(new ErrorHandler("You have already purchased this course",400))
    }
    const course = await CourseModel.findById(courseId);
    if(!course){
        return next (new ErrorHandler("No course found",400));
    }
    const data:any = {
        courseId:course?._id,
        userId:user?._id
    }
    newOrder(data,res,next);
    const mailData={
        
    }
})