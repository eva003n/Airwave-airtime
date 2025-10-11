import type {
  BulkRecipientData,
  Id,
  PaginateData,
  RecipientData,
} from "../middlewares/validators/validators.js";
import Recipient from "../models/Recipients.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";

const createRecipient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      operator,
      designation,
      branch,
      airtime_amount,
      phone_number,
    }: RecipientData = req.body;

    const operatorCode = operator === "Safaricom" ? 266 : 265;

    const isRecipient = await Recipient.findOne({ where: { phone_number } });
    if (isRecipient)
      return next(
        ApiError.conflictRequest(
          409,
          req.originalUrl,
          "Recipient with same phone number already exist"
        )
      );

    const newRecipient = await Recipient.create({
      name,
      operator,
      operator_code: operatorCode,
      designation,
      branch,
      airtime_amount,
      phone_number,
      // user_id: req.user.id
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, newRecipient, "Recipient created successfully")
      );
  }
);

const createRecipients = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const recipients: BulkRecipientData = req.body;

    //check for duplicates
    const existingRecipients = await Recipient.findAll();

    const isDuplicate = existingRecipients.filter((recipient) => {
      return recipients.filter(
        (newRecipient) => recipient.phone_number === newRecipient.phone_number
      );
    });

    if (isDuplicate)
      return next(
        ApiError.conflictRequest(
          409,
          req.originalUrl,
          "Failed to create duplicate recipients"
        )
      );

    const newReipients = await Recipient.bulkCreate(recipients);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          newReipients,
          "Successfully created multiple recipients"
        )
      );
  }
);

const updateRecipient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    const {
      name,
      operator,
      designation,
      branch,
      airtime_amount,
      phone_number,
    }: RecipientData = req.body;

    const operatorCode = operator === "Safaricom" ? 266 : 265;

    const isRecipient = await Recipient.findByPk(id);
    if (!isRecipient)
      return next(
        ApiError.notFound(404, req.originalUrl, "Recipient does not exist")
      );

    isRecipient.name = name;
    isRecipient.operator = operator;
    isRecipient.phone_number = phone_number;
    isRecipient.airtime_amount = airtime_amount;
    isRecipient.designation = designation;
    isRecipient.operator_code = operatorCode;
    isRecipient.branch = branch;

    const updatedRecipient = await isRecipient.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, updatedRecipient, "Recipient Updated successfully")
      );
  }
);
const deleteRecipient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    const isRecipient = await Recipient.findByPk(id);
    if (!isRecipient)
      return next(
        ApiError.notFound(
          404,
          req.originalUrl,
          "Recipient does not exist or is already deleted"
        )
      );

    await Recipient.destroy({ where: { id } });

    return res
      .status(201)
      .json(new ApiResponse(200, null, "Recipient deleted successfully"));
  }
);

const getAllrecipients = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await getPaginatedRecipients(page, limit);

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Recipients fetched successfully"));
  }
);

const getRecipient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;
    const isRecipient = await Recipient.findByPk(id);
    if (!isRecipient)
      return next(
        ApiError.notFound(404, req.originalUrl, "Recipient doesn't exist")
      );

    return res
      .status(200)
      .json(
        new ApiResponse(200, isRecipient, "Recipient fetched successfully")
      );
  }
);

const getPaginatedRecipients = async (page = 1, limit = 10) => {
  //inplements page by page logic
  const offset = (page - 1) * limit;

  const { rows, count } = await Recipient.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    recipients: rows,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    totalItems: count,
  };
};
export {
  createRecipient,
  createRecipients,
  updateRecipient,
  deleteRecipient,
  getAllrecipients,
  getRecipient,
};
