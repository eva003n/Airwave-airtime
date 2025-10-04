import type { Request, Response, NextFunction } from "express";


//ffunction type expression
type requestFunc = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;
const asyncHandler = (requestHandler: requestFunc) => {
  return (req: Request , res: Response, next: NextFunction) => {
  Promise.resolve(requestHandler(req, res, next)).catch((err) => {
    return next(err);
  });
  };
};

export default asyncHandler;
