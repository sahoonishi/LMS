import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.model";
import { getAllOrders, newOrder } from "../services/order.service";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import mongoose from "mongoose";

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
        userId:user?._id,
        payment_info
    }
    
    const mailData={
        order:{
            _id:(course?._id as string)?.toString().slice(0,6),
            name:course.name,
            price:course.name,
            date:new Date().toLocaleDateString('en_US',{year:'numeric',month:'long',day:'numeric'})
        }
    }
    const html = await ejs.renderFile(path.join(__dirname,'../mails/order-confirmation.ejs'),{data:mailData});
    try {
        if(user){
            await sendMail({
                email:user.email,
                subject:"Order confirmation",
                template:"order-confirmation.ejs",
                data:mailData
            })
        }
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500));
    }
    user?.courses?.push({ courseId: course._id as mongoose.Types.ObjectId });
    await user?.save();
    await NotificationModel.create({
        userId:user?._id,
        title:"New Order",
        message:`You have a new order from ${course?.name}`,
    })
    course.purchased ? course.purchased +=1 : course.purchased;
    await course.save();
    newOrder(data,res,next);
})

export const getAllorders = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  getAllOrders(res);
})