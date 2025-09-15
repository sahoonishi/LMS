
import express from "express";
import { isAuth, ValidateUserRole } from "../middleware/isAuth";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllers/analytics.controller";

const analyticsRouter = express.Router();

analyticsRouter.get('/getallusers',isAuth,ValidateUserRole("admin"),getUserAnalytics);
analyticsRouter.get('/getallcourses',isAuth,ValidateUserRole("admin"),getCourseAnalytics);
analyticsRouter.get('/getallorders',isAuth,ValidateUserRole("admin"),getOrderAnalytics);

export default analyticsRouter;