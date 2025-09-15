import express from "express";
import { isAuth } from "../middleware/isAuth";
import { createOrder } from "../controllers/order.controller";

const orderRouter = express.Router();
orderRouter.post("/createorder",isAuth,createOrder);
export default orderRouter;