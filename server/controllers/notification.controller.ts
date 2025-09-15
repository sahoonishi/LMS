import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import NotificationModel from "../models/notification.model";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron"

// get all notifications (only for admin)
export const getAllNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const notis = await NotificationModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      notis,
      message: "All Notifications fetched",
    });
  }
);
// update notification status (for only admin)

export const updateNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const notification = await NotificationModel.findByIdAndUpdate(
      req.params.id,
      { status: "Read" },
      { new: true } // return updated document
    );
    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    }
    const notifications = await NotificationModel.find().sort({
      createdAt: -1,
    });
    res.status(200).json({
      message: "Notification updated",
      success: true,
      notifications,
    });
  }
);

// delete ---only admin

cron.schedule("0 0 0 * * *",async()=>{
  const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000);
  await NotificationModel.deleteMany({status:"Read",createdAt:{$gt:thirtyDaysAgo}});
})