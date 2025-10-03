import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import type {
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

const signUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName, email, password } = req.body as SignUpAuth;

      const isUser = await User.findOne({ where: { email: email } });

    if (!isUser)
      return next(
        ApiError.conflictRequest(
          409,
          req.originalUrl,
          "Account already exist, kindly sign in to your account"
        )
      );

    const newUser = await User.create({
      username: userName,
      email: email,
      password: password,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          newUser,
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
    const isValidPassword = await compare(password, isUser.get("password"));

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
      .json(new ApiResponse(200, isUser, "Signed in successfully"));
  }
);
const signOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user)
      return next(
        ApiError.notFound(
          404,
          `${req.originalUrl}`,
          "Account doesn't not exist"
        )
      );
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
    const { RefreshToken, AccessToken } = req.cookies;
    // if(AccessToken) return

    if (!RefreshToken) {
      return next(
        ApiError.badRequest(
          400,
          `${req.originalUrl}`,
          "No refresh token provided"
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
          "Account  doesn't not exist"
        )
      );
    // if (user.refresh_token !== RefreshToken) {
    //   return next(
    //     ApiError.unAuthorizedRequest(
    //       401,g
    //       `${req.originalUrl}`,
    //       "Invalid refresh token provided"
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
          { accessToken },
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
  res
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
