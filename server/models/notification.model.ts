import mongoose, { Document, Model, mongo, Schema } from "mongoose";

export interface INotification extends  Document { 
    title:string;
    message:string;
    userId:string;
    status:string;
}
const notificationSchema = new Schema<INotification>({
    title:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:"Unread"
    }
},{timestamps:true});

const NotificationModel:Model<INotification>  = mongoose.model("Notification",notificationSchema);
export default NotificationModel;