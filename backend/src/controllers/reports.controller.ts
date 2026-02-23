import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";

import type {
  Id,
} from "../middlewares/validators/validators.js";
import ApiResponse from "../utils/ApiResponse.js";

import { generateAdminAnalytics, generateUserAnalytics } from "../services/report.service.js";

const getAnalytics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;
    const analytics = await generateUserAnalytics(id);

    return res
      .status(200)
      .json(new ApiResponse(200, analytics, "Analytics fetched successfully"));
  }
);

/*------ Admin ----- */

const getAdminAnalytics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
  
    const analytics = await generateAdminAnalytics()

    return res.status(200).json(
      new ApiResponse(
        200,
        analytics,
        "Analytics fetched successfully"
      )
    );
  }
);


export { getAnalytics, getAdminAnalytics };
