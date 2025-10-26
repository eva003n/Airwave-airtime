import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import type {
  CookieData,
  Id,
  SignInAuth,
  SignUpAuth,
  Token,
} from "../middlewares/validators/validators.js";
import ApiResponse from "../utils/ApiResponse.js";
import User, { UserRole } from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { compare } from "bcryptjs";
import jwt, {
  type JwtPayload,
  type Secret,
  type SignOptions,
} from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  APP_NAME,
  NODE_ENV,
} from "../config/env.js";
import { Op } from "sequelize";

const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName, email, password } = req.body as SignUpAuth;

    const [ user, created ] = await User.findOrCreate({
      where: {[ Op.or]: [{ email: email }, { username: userName }] },
      defaults: {
        username: userName,
        email: email,
      password: password,
      },
    });

      // const isUser = await User.findOne({ where: { or: [{ email: email }, { username: userName }] } });

    if (!created)
      return next(
        ApiError.conflictRequest(
          409,
          req.originalUrl,
          "Account already exist, kindly sign in to your account"
        )
      );

    // const newUser = await User.create({
    //   username: userName,
    //   email: email,
    //   password: password,
    // });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user,
          "Account created successfully, please login"
        )
      );
  }
);
const signIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName, password } = req.body as SignInAuth;
    //check if account exist
    const isUser = await User.findOne({ where: { username: userName } });

    if (!isUser)
      return next(
        ApiError.notFound(
          404,
          req.originalUrl,
          "Account doesnt exist, kindly create an account"
        )
      );

    //verify password
    const isValidPassword = await compare(password, isUser.password as string);
    console.log(isUser.password)

    if (!isValidPassword)
      return next(
        ApiError.unAuthorizedRequest(
          403,
          req.originalUrl,
          "Invalid username or password"
        )
      );

    //generate token for user session
    const { accessToken, refreshToken } = generateToken(
      isUser.id as string,
      isUser.email
    );

    //save refresh token in database
    isUser.refresh_token = refreshToken;
    await isUser.save();

    configureAndSendCookie(res, accessToken, refreshToken);

    return res
      .status(200)
      .json(new ApiResponse(200, { user: isUser }, "Signed in successfully"));
  }
);
const signOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {id } = req.params as Id
    const user = await User.findOne({ where: { id} });
    if (!user)
      return next(
        ApiError.notFound(
          404,
          `${req.originalUrl}`,
          "Account doesn't not exist"
        )
      );
//make request idempotent
    if(!user.refresh_token) return next(ApiError.unprocessable(422, req.originalUrl, "Already signed out"))

    user.refresh_token = "";
    await user.save();

    return res
      .status(200)
      .clearCookie("AccessToken")
      .clearCookie("RefreshToken")
      .json(new ApiResponse(200, null, "Signed out successfully"));
  }
);

const tokenRefresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { RefreshToken } = req.cookies as CookieData;

    if (!RefreshToken) {
      return next(
        ApiError.unAuthorizedRequest(
          401,
          `${req.originalUrl}`,
         NODE_ENV === "development"?  "No refresh token provided": "Unauthorized, please logout"
        )
      );
    }
    //verify refresh token
    const decodeToken = jwt.verify(
      RefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as JwtPayload;

    const user = await User.findOne({ where: { id: decodeToken.userId } });
    if (!user)
      return next(
        ApiError.notFound(
          404,
          `${req.originalUrl}`,
          "Account doesn't not exist, create an account"
        )
      );

    //   console.log(user.refresh_token)
    //   console.log(user.refresh_token !== RefreshToken)
    // if (user.refresh_token && user.get("refresh_token") !== RefreshToken) {
    //   return next(
    //     ApiError.unAuthorizedRequest(
    //       401,
    //       `${req.originalUrl}`,
    //      NODE_ENV === "development"?  "Invalid refresh token provided": "Unauthorized please logout"
    //     )
    //   );
    // }

    //generate new access & refresh token
    const { accessToken, refreshToken: newRefreshToken } = generateToken(
      user.id as string,
      user.email
    );
    //update user refresh token
    user.refresh_token = newRefreshToken;
    await user.save();
    //configure and send cookie
    configureAndSendCookie(res, accessToken, newRefreshToken);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { access_token:accessToken, expires_in: 900, token_type: "Bearer" },
          "Access token refreshed successfully"
        )
      );
  }
);

const generateToken = (userId: string, userEmail: string) => {
  const jwtAccessTokenSecret: Secret = ACCESS_TOKEN_SECRET as string;
  const jwtRefreshTokenSecret: Secret = REFRESH_TOKEN_SECRET as string;


  const accessToken = jwt.sign(
    //header -> signing algorithm and token type
    //payload
    {
      userId,
      userEmail,
    },
    //signing secret
    jwtAccessTokenSecret,
    //sign options
    {
      expiresIn: ACCESS_TOKEN_EXPIRY || "15m",
      issuer: APP_NAME || "Airwave airtime",
      subject: "Authentication",
    } as SignOptions
  );

  const refreshToken = jwt.sign({ userId, userEmail }, jwtRefreshTokenSecret, {
    expiresIn: REFRESH_TOKEN_EXPIRY || "1d",
    issuer: APP_NAME || "Airwave airtime",
    subject: "Authentication",
  } as SignOptions);

  return { accessToken, refreshToken };
};

const configureAndSendCookie = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  return res
    .cookie("AccessToken", accessToken, {
      httpOnly: true, //prevent xss attacks
      maxAge: 15 * 60 * 1000, //15min
      secure: NODE_ENV === "production",
      sameSite: "strict",
    })
    .cookie("RefreshToken", refreshToken, {
      httpOnly: true, //prevent xss attacks
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, //1day
    });
};
export { signUp, signIn, signOut, tokenRefresh };
