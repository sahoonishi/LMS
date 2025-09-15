import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

export const createCourse = CatchAsyncError(async(data:any,res:Response)=>{
    const course = await CourseModel.create(data);
    res.status(201).json({
        success:true,
        message:"Course created successfully",
        course
    })
})

export const getAllcourses = async (res:Response)=>{
    const courses = await CourseModel.find().sort({createdAt:-1});
    res.status(200).json({
        message:"All courses fetched",
        success:true,
        courses
    })
}