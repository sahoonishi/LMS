import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";

export const uploadcourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const thumbnail = data?.thumbnail;
    if (thumbnail) {
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "LMSCourses",
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    createCourse(data, res, next);
  }
);

// EDIT COURSE

export const editcourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      // 1. Get the old thumbnail's public_id (before overwriting)
      const oldPublicId = data.thumbnail?.public_id;

      // 2. Upload new thumbnail
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
      });

      // 3. Delete old thumbnail using the OLD public_id
      if (oldPublicId) {
        await cloudinary.v2.uploader.destroy(oldPublicId);
      }

      // 4. Update with NEW thumbnail info
      data.thumbnail = {
        public_id: myCloud.public_id, // This is the NEW public_id
        url: myCloud.secure_url,
      };
    }

    const courseId = req.params.id;
    const course = await CourseModel.findByIdAndUpdate(
      courseId,
      { $set: data },
      { new: true }
    );
    res.status(201).json({
      success: true,
      course,
      message: "Course updated successfully",
    });
  }
);

// GET SINGLE COURSE WITHOUT PURCHASING (EVERYONE CAN ACCESS IT)

export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseid = req.params.id;
    const isCacheExist = await redis.get(courseid);
    if (isCacheExist) {
      const course = JSON.parse(isCacheExist);
      return res.status(200).json({
        success: true,
        course,
        message: "Course has fetched",
      });
    } else {
      const course = await CourseModel.findById(req.params.id).select(
        "-courseData.videoUrl -courseData.suggesstion -courseData.questions -courseData.links"
      );
      await redis.set(courseid, JSON.stringify(course));
      res.status(200).json({
        success: true,
        course,
        message: "Course has fetched",
      });
    }
  }
);

// GET ALL COURSE WITHOUT PURCHASING (EVERYONE CAN ACCESS IT)

export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const isCacheExist = await redis.get("allcourses");
    if(isCacheExist){
        const courses = JSON.parse(isCacheExist);
        res.status(200).json({
            message:"All courses fetched",
            success:true,
            courses
        })
    }else{
        const allCourses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggesstion -courseData.questions -courseData.links"
        );
        await redis.set("allcourses" , JSON.stringify(allCourses));
        res.status(200).json({
          success: true,
          allCourses,
          message: "All Courses has fetched",
        });
    }
  }
);
