import type {
  BulkRecipientData,
  Id,
  RecipientData,
} from "../middlewares/validators/validators.js";
import {
  createBulkRecipeents,
  createNewRecipient,
  deleteExistingRecipient,
  getPaginatedRecipients,
  getSingleRecipient,
  updateExistingRecipient,
} from "../services/recipient.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";

const createRecipient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const recipientData: RecipientData = req.body;

    const { recipient, newRecipient } = await createNewRecipient(
      recipientData,
      req.user,
    );

    if (recipient)
      return next(
        ApiError.conflictRequest(
          409,
          req.originalUrl,
          "Recipient with same phone number already exist",
        ),
      );

    return res
      .status(201)
      .json(
        new ApiResponse(201, newRecipient, "Recipient created successfully"),
      );
  },
);

const createRecipients = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const recipients: BulkRecipientData = req.body;

    const newRecipients = await createBulkRecipeents(recipients);

    res
      .status(200)
      .json(
        new ApiResponse(200, newRecipients, "Successfully created recipients"),
      );
  },
);

const updateRecipient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;
    const recipientData: RecipientData = req.body;

    const { oldRecipient, newRecipient } = await updateExistingRecipient(
      id,
      recipientData,
    );

    if (!oldRecipient)
      return next(
        ApiError.notFound(404, req.originalUrl, "Recipient does not exist"),
      );

    return res
      .status(201)
      .json(
        new ApiResponse(201, newRecipient, "Recipient Updated successfully"),
      );
  },
);
const deleteRecipient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    const recipient = await deleteExistingRecipient(id);

    if (!recipient)
      return next(
        ApiError.notFound(
          404,
          req.originalUrl,
          "Recipient does not exist or is already deleted",
        ),
      );

    return res
      .status(201)
      .json(new ApiResponse(201, null, "Recipient deleted successfully"));
  },
);

const getAllRecipients = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const filterOptions = {
      page: page,
      limit: limit,
      branch: req.query.branch as string,
      department: req.query.department as string,
      name: req.query.name as string,
    };
    const data = await getPaginatedRecipients(filterOptions);

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Recipients fetched successfully"));
  },
);

const getRecipient = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;
    const recipient = await getSingleRecipient(id);

    return res
      .status(200)
      .json(new ApiResponse(200, recipient, "Recipient fetched successfully"));
  },
);

export {
  createRecipient,
  createRecipients,
  updateRecipient,
  deleteRecipient,
  getAllRecipients,
  getRecipient,
};
