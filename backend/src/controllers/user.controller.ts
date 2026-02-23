import { type Request, type Response, type NextFunction } from "express";

import asyncHandler from "../utils/asyncHandler.js";
import type { Id } from "../middlewares/validators/validators.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { fa } from "zod/locales";
import { Op } from "sequelize";
import { addUser, editUser, findUser, getPaginatedUsers, removeUser } from "../services/user.service.js";


const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;
    const {
      username: userName,
      email,
      role,
      password,
      is_MFA_enabled,
    }: User = req.body;

    const user = await editUser(req.body, id)

    
    if (!user)
      return next(
        ApiError.notFound(404, req.originalUrl, "User does not exist"),
      );


    return res
      .status(201)
      .json(new ApiResponse(201, user, "User updated successfully"));
  }
);

const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const name = req.query.name as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const users = await getPaginatedUsers({page, limit, name});

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  }
);

const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    const user = await removeUser(id);

    if (!user)
      return next(
        ApiError.notFound(
          404,
          req.originalUrl,
          "User does not exist or is already deleted"
        )
      );

    return res
      .status(201)
      .json(new ApiResponse(201, null, "User deleted successfully"));
  }
);

const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, is_MFA_enabled, role }: User = req.body;

    //  const operatorCode = operator === "Safaricom" ? 266 : 265;

    const {user, newUser} = await addUser({username, email, password: password as string, is_MFA_enabled: is_MFA_enabled as boolean, role: role as string})
   
    if (user)
      return next(
        ApiError.conflictRequest(
          409,
          req.originalUrl,
          "User with same name or email already exist"
        )
      );

    return res
      .status(201)
      .json(
        new ApiResponse(201, newUser, "User created successfully")
      );
  }
);

const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    const user = await findUser(id);

    if (!user)
      return next(
        ApiError.notFound(404, req.originalUrl, "User doesn't exist")
      );

    return res
      .status(200)
      .json(
        new ApiResponse(200, user, "User fetched successfully")
      );
  }
);



export { getUser, createUser, updateUser, getAllUsers, deleteUser };
