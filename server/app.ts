import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
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



// Testing API
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hi");
});

app.all("/{*any}", (req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error(`Route ${req.originalUrl} not found`) as any;
  error.statusCode = 404;
  next(error);
});


