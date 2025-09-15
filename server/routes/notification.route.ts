import express from "express";
import { isAuth, ValidateUserRole } from "../middleware/isAuth";
import { getAllNotification, updateNotification } from "../controllers/notification.controller";

const notificationRouter = express.Router();
notificationRouter.get('/getallnotifications',isAuth,ValidateUserRole("admin"),getAllNotification);
notificationRouter.put('/updatenotifications/:id',isAuth,ValidateUserRole("admin"),updateNotification);

export default notificationRouter;