import mongoose, { Document, Model, Schema } from "mongoose";

export interface INotification extends Document { 
  title: string;
  message: string;
  userId: mongoose.Types.ObjectId; // Reference to User
  status: string;
}

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // connects to User model
      required: true,
    },
    status: {
      type: String,
      default: "Unread",
      enum: ["Unread", "Read"], // optional, but safer
    },
  },
  { timestamps: true }
);

const NotificationModel: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default NotificationModel;
