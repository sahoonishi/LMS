import { NextFunction, Request, Response } from "express";

//? ITS LIKE ASYNC HANDLER

export const CatchAsyncError =
  (theFunc: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };
