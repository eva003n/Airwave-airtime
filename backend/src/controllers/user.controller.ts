import { type Request, type Response, type NextFunction } from "express";

import asyncHandler from "../utils/asyncHandler.js";
import type { Id } from "../middlewares/validators/validators.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { fa } from "zod/locales";
import { Op } from "sequelize";


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

    const isUser = await User.findByPk(id);

    if (!isUser)
      return next(
        ApiError.notFound(404, req.originalUrl, "User does not exist")
      );
    isUser.set({
      username: userName,
      email,
      role,
      password,
      is_MFA_enabled,
    });

    const updatedUser = await isUser.save({ validate: false });

    return res
      .status(201)
      .json(new ApiResponse(201, updatedUser, "User updated successfully"));
  }
);

const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const name = req.query.name as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const users = await getPaginatedUsers(page, limit, name);

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  }
);

const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    const isUser = await User.findByPk(id);

    if (!isUser)
      return next(
        ApiError.notFound(
          404,
          req.originalUrl,
          "User does not exist or is already deleted"
        )
      );

    await User.destroy({ where: { id } });

    return res
      .status(201)
      .json(new ApiResponse(201, null, "User deleted successfully"));
  }
);

const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, is_MFA_enabled, role }: User = req.body;

    //  const operatorCode = operator === "Safaricom" ? 266 : 265;

    const isUser = await User.findOne({
      where: { [Op.or]: [{ email: email }, { username: username }] },
    });
    if (isUser)
      return next(
        ApiError.conflictRequest(
          409,
          req.originalUrl,
          "User with same name or email already exist"
        )
      );

    const newUser = await User.create({
    username,
    email,
    password,
    is_MFA_enabled,
    role
    });

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

    const isUser = await User.findByPk(id);
    if (!isUser)
      return next(
        ApiError.notFound(404, req.originalUrl, "User doesn't exist")
      );

    return res
      .status(200)
      .json(
        new ApiResponse(200, isUser, "User fetched successfully")
      );
  }
);

const getPaginatedUsers = async (page = 1, limit = 10, name?: string) => {
  //inplements page by page logic
  const offset = (page - 1) * limit;

  //build an object of dynamic filters
  const filters = { name };

  //convert resulting array to object for filtering
  const where = Object.fromEntries(
    //build an array of key value pairs removing empty values
    Object.entries(filters).filter(([_, v]) => v?.toString().trim())
  );

  const { rows, count } = await User.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    users: rows.map((user) => user.toJSON(true)),
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    totalItems: count,
  };
};

export { getUser, createUser, updateUser, getAllUsers, deleteUser };
