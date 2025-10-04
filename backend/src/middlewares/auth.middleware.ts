import type { Request, Response, NextFunction } from "express";
import Jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";




const protectRoute = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { AccessToken } = req.cookies;
    //extract accesstoken from cookies]
    if (!AccessToken)
      return next(
        ApiError.unAuthorizedRequest(
          401,
          req.originalUrl,
          "Unauthorized request, access token is required"
        )
      );
    //decode accesstoken with token secret to check validity

    const decodedToken = Jwt.verify(
      AccessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    //query db with user credentials
    const user = await User.findOne({where: {id: decodedToken.userId}})
    if (!user)
      return next(
        ApiError.unAuthorizedRequest(
          401,
          req.originalUrl,
          "Unauthorized request, account doesn't exist or is already deleted"
        )
      );

    // attach the user to request obj
    req.user = user;

    next();
  }
);

export {
  protectRoute
}