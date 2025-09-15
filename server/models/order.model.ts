import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document{
courseId:mongoose.Types.ObjectId;
userId:mongoose.Types.ObjectId;
payment_info:Record<string,any>;
}
const orderSchema = new Schema<IOrder>({
    courseId:{
        type:Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    payment_info: { type: Schema.Types.Mixed }

},{timestamps:true});

const OrderModel:Model<IOrder> = mongoose.model('Order',orderSchema);
export default OrderModel;