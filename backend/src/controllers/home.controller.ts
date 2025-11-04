import type { Request, Response, NextFunction } from "express";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { app } from "../app.js";

const home = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, {
        version: "1.0",
        environment: app.get("env")
      }, "Welcome to Airwave airtime API"));
  }
);

export { home };
