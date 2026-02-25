import type { Request, Response, NextFunction } from "express";
import Jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { app } from "../app.js";
import { NODE_ENV } from "../config/env.js";
import type { CookieData } from "./validators/validators.js";




const protectRoute = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { AccessToken } = req.signedCookies as CookieData;
    //extract accesstoken from cookies
    if (!AccessToken)
      return next(
        ApiError.badRequest(
          400,
          req.originalUrl,
          NODE_ENV === "development"
            ? "Bad  request, access token is required"
            : "Bad request"
        )
      );
    //decode accesstoken with token secret to check validity

    const decodedToken = Jwt.verify(
      AccessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    // sanitize jwt data

    //query db with user credentials
    const user = await User.findOne({where: {id: decodedToken.userId}})
    if (!user)
      return next(
        ApiError.unAuthorizedRequest(
          401,
          req.originalUrl,
          NODE_ENV === "development"
            ? "Unauthorized request, account doesn't exist or is already deleted"
            : "Unauthorized request",
        ),
      );

    // attach the user to request object
    req.user = user;

    next();
  }
);


const privateRoute = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if(req.user && req.user.role !== "admin") {
        return next(
          ApiError.forbiddenRequest(
            403,
            req.originalUrl,
            NODE_ENV === "development"
              ? "Forbidden request, user is not admin"
              : "Forbidden request, contact administator ",
          ),
        );
      }

      next();

    }
)
export {
  protectRoute,
  privateRoute,
}