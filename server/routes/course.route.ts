import express from "express";
import { isAuth, ValidateUserRole } from "../middleware/isAuth";
import { addQuestion, editcourse, getAllCourses, getCourseForValidUser, getSingleCourse, uploadcourse } from "../controllers/course.controller";

const courseRouter = express.Router();
courseRouter.post('/createcourse' , isAuth , ValidateUserRole("admin"),uploadcourse);
courseRouter.put('/updatecourse/:id' , isAuth , ValidateUserRole("admin"),editcourse);
courseRouter.get('/getsinglecourse/:id' ,getSingleCourse);
courseRouter.get('/getallcourses' ,getAllCourses);
courseRouter.get('/getcoursecontent/:id',isAuth ,getCourseForValidUser);
courseRouter.put('/addquestion',isAuth ,addQuestion);

export default courseRouter;