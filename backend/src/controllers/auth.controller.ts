import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import type {
  CookieData,
  SignInAuth,
  SignUpAuth,
} from "../middlewares/validators/validators.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import {
  NODE_ENV,
} from "../config/env.js";

import { logInUser, logOutUser, refreshUserToken, registerUser } from "../services/auth.service.js";

const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName: username, email, password } = req.body as SignUpAuth;

    const userData = {
      username,
      email,
      password
    }

    const {user, newUser} = await registerUser(userData)

    if(user) {
      return next(
        ApiError.unprocessable(
          422,
          req.originalUrl,
          "Authentication failed",
        ),
      );
    }
       return res
         .status(200)
         .json(
           new ApiResponse(
             200,
             newUser,
             "Account created successfully, please login",
           ),
         );
   
  },
);
const signIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName: username, password } = req.body as SignInAuth;
   
    const {user, valid, accessToken, refreshToken} = await logInUser({username, password})
    if(!user) {
      return next(ApiError.unAuthorizedRequest(401, req.originalUrl, "Authentication failed"))
    }

    if(valid === false) return next(ApiError.forbiddenRequest(403, req.originalUrl, "Authentication failed"))

      configureAndSendCookie(res, accessToken, refreshToken);

    return res
      .status(200)
      .json(new ApiResponse(200, { user: user }, "Signed in successfully"));
  },
);
const signOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await logOutUser(req.user.id)
   
    return res
      .status(200)
      .clearCookie("AccessToken")
      .clearCookie("RefreshToken")
      .json(new ApiResponse(200, null, "Signed out successfully"));
  },
);

const tokenRefresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { RefreshToken } = req.signedCookies as CookieData;

    if (!RefreshToken) {
      return next(
        ApiError.badRequest(
          400,
          `${req.originalUrl}`,
          NODE_ENV === "development"
            ? "No refresh token provided"
            : "Bad request",
        ),
      );
    }
   
    const {user, accessToken, newRefreshToken} = await refreshUserToken(RefreshToken);

    // if user doesnt exists
    if(!user) {
      return next(ApiError.forbiddenRequest(403, req.originalUrl, "Forbidden"));
    }

    //configure and send cookie
    configureAndSendCookie(res, accessToken, newRefreshToken);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { access_token: accessToken, expires_in: 900, token_type: "Bearer" },
          "Token generated successfully",
        ),
      );
  },
);


const configureAndSendCookie = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  return res
    .cookie("AccessToken", accessToken, {
      httpOnly: true, //prevent xss attacks
      maxAge: 15 * 60 * 1000, //15min
      secure: NODE_ENV === "production",
      sameSite: "strict",
      signed: true,
    })
    .cookie("RefreshToken", refreshToken, {
      httpOnly: true, //prevent xss attacks
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, //1day
      signed: true
    });
};
export { signUp, signIn, signOut, tokenRefresh };
