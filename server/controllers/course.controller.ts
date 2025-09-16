import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import cloudinary from "cloudinary";
import { createCourse,getAllcourses } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { IUser } from "../models/user.model";
import NotificationModel from "../models/notification.model";

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
      await redis.expire(courseid, 604800);
      return res.status(200).json({
        success: true,
        course,
        message: "Course has fetched",
      });
    } else {
      const course = await CourseModel.findById(req.params.id).select(
        "-courseData.videoUrl -courseData.suggesstion -courseData.questions -courseData.links"
      );
      await redis.set(courseid, JSON.stringify(course),"EX",604800);
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
    if (isCacheExist) {
      const courses = JSON.parse(isCacheExist);
      res.status(200).json({
        message: "All courses fetched",
        success: true,
        courses,
      });
    } else {
      const allCourses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggesstion -courseData.questions -courseData.links"
      );
      await redis.set("allcourses", JSON.stringify(allCourses));
      res.status(200).json({
        success: true,
        allCourses,
        message: "All Courses has fetched",
      });
    }
  }
);

// GET COURSE FOR VALID USER

export const getCourseForValidUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const courses = req.user?.courses;
    const courseId = req.params.id;

    const isCourseExist = courses?.find(
      (item: any) => item?.toString() === courseId
    );
    if (!isCourseExist) {
      return next(new ErrorHandler("You have to purchase it", 400));
    }

    const course = await CourseModel.findById(courseId);
    const content = course?.courseData;
    res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      content,
    });
  }
);

//ADD QUESTION IN COURSE

interface IAddquestion {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { question, courseId, contentId }: IAddquestion = req.body;
    const course = await CourseModel.findById(courseId);
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid contentId", 400));
    }
    const courseContent = course?.courseData.find((item: any) =>
      item._id.equals(contentId)
    );
    if (!courseContent) {
      return next(new ErrorHandler("Invalid content ID", 400));
    }

    // then create a new question object
    const newQuestion: any = {
      user: req.user,
      question,
      questionReplies: [],
    };

    courseContent.questions.push(newQuestion);
    await NotificationModel.create({
      user:req.user?._id,
      title:"New Question added",
      message:`You have a new notification in ${courseContent?.title}`
    })
    await course?.save();
    res.status(200).json({
      success: true,
      course,
    });
  }
);

// ADD ANSWERS IN QUESTION

interface IAddAnswer {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { answer, courseId, contentId, questionId }: IAddAnswer = req.body;
    const course = await CourseModel.findById(courseId).populate({
      path: "courseData.questions.user",
      select: "name email avatar role isVerified courses", // explicitly include only these fields
    });
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid content ID", 400));
    }
    const courseContent = course?.courseData?.find((item: any) =>
      item?._id.equals(contentId)
    );
    if (!courseContent) {
      return next(new ErrorHandler("Invalid Content ID", 400));
    }
    const question = courseContent?.questions?.find((item: any) =>
      item?._id.equals(questionId)
    );
    if (!question) {
      return next(new ErrorHandler("Invalid questionID", 400));
    }
    // create a new answer object
    const newAnswer: any = {
      user: req?.user,
      answer,
    };
    // adding the answer to the course content
    question.questionReplies?.push(newAnswer);
    await course?.save();
    if (req.user?.id === question?.user?._id) {
      // create notification logix
      await NotificationModel.create({
        user:req.user?._id,
        title:"New Reply has added",
        message:`You have new reply in ${courseContent?.title}`
      })
    } else {
      const data = {
        name: (question.user as IUser).name,
        title: courseContent.title,
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/question-reply.ejs"),
        data
      );
      try {
        await sendMail({
          email: (question.user as IUser).email,
          subject: "Question Reply",
          template: "question-reply.ejs",
          data,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
      res.status(200).json({
        success: true,
        course,
      });
    }
  }
);

// ADD REVIEW

interface IReviewData {
  review: string;
  rating: number;
  userid: string;
}
export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;
    const isCourseExist = userCourseList?.some((item: any) =>
      item?._id.equals(courseId)
    );
    if (!isCourseExist) {
      return next(
        new ErrorHandler("You are not eligible for this course", 400)
      );
    }
    const course = await CourseModel.findById(courseId);
    const { rating, review }: IReviewData = req.body;
    const reviewData: any = {
      user: req.user,
      rating,
      comment: review,
    };
    course?.reviews.push(reviewData);

    let total = 0;
    course?.reviews.forEach((item: any) => {
      total += item.rating;
    });
    if (course) {
      course.rating = total / course.reviews.length;
    }
    await course?.save();
    const notification = {
      title: "New Review Added",
      message: `${req?.user?.name} has added a review on ${course?.name} course!!`,
    };
    // create a notification

    res.status(200).json({
      success: true,
      course,
      message: "Review added successfully",
    });
  }
);

interface IReviewData {
  comment: string;
  courseId: string;
  reviewId: String;
}

export const addReplytoReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { comment, courseId, reviewId }: IReviewData = req.body;
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 400));
    }
    const review = course?.reviews?.find((rev: any) =>
      rev._id.equals(reviewId)
    );
    if (!review) {
      return next(new ErrorHandler("Review not found", 400));
    }
    const replyData: any = {
      user: req?.user,
      comment,
    };
    review?.commentReplies?.push(replyData);
    await course.save();
    res.status(200).json({
      message: "Reply added in review",
      success: true,
      course,
    });
  }
);

export const getAllCOurses = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  getAllcourses(res);
})
export const deleteCourse=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  const {id} = req.params;
  const course = await CourseModel.findByIdAndDelete(id);
  if(!course){
    return next(new ErrorHandler("Course not found",404))
  }
  await redis.del(id);
  return res.status(200).json({
    message:"Course deleted",
    success:true
  })
})