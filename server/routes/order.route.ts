import express from "express";
import { isAuth } from "../middleware/isAuth";
import { createOrder, getAllorders } from "../controllers/order.controller";

const orderRouter = express.Router();
orderRouter.post("/createorder",isAuth,createOrder);
orderRouter.get("/getall",isAuth,getAllorders);
export default orderRouter;