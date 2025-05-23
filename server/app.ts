import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";

dotenv.config();
export const app = express();

// body parser
app.use(express.json({ limit: "50mb" }));
// cookie parser
app.use(cookieParser());
// cors
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

//?---------------------------------------ALL ROUTES----------------------------------------------
app.use("/api/v1/user",userRouter);

// Testing API
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message:"Success",
    success:true
  })
});

app.all("/{*any}", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found`) as any;
  error.statusCode = 404;
  next(error);
  
});

app.use(ErrorMiddleware);


