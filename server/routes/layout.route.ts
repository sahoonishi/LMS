import express from "express";
import { isAuth, ValidateUserRole } from "../middleware/isAuth";
import { createLayout, editLayout, getLayoutType } from "../controllers/layout.controller";

const layoutRouter = express.Router();
layoutRouter.post('/create-layout',isAuth,ValidateUserRole("admin"),createLayout);
layoutRouter.put('/edit-layout',isAuth,ValidateUserRole("admin"),editLayout);
layoutRouter.get('/get-layout',getLayoutType);
export default layoutRouter;