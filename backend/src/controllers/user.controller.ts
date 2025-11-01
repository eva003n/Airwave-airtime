import type { Request, Response, NextFunction } from "express";

import asyncHandler from "../utils/asyncHandler.js";
import type { Id } from "../middlewares/validators/validators.js";
import  User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { fa } from "zod/locales";

const getUser = asyncHandler(async () => {});

const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
const { id } = req.params as Id;
const { username: userName, email, role, password }: User = req.body;

const isUser = await User.findByPk(id);

if(!isUser) return next(ApiError.notFound(404, req.originalUrl, "User does not exist"));
 isUser.set(
  {
    username: userName,
    email,
    role,
    password,
  });

  const updatedUser = await isUser.save({ validate: false });

  return res
    .status(201)
    .json(new ApiResponse(201, updatedUser, "User updated successfully"));
  }

)

export { getUser, updateUser };
