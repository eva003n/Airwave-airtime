import type { Request, Response, NextFunction } from "express";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { app } from "../app.js";
import { NODE_ENV, BASE_URL } from "../config/env.js";

const home = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(new ApiResponse(200, {
        version: "1.0",
        // env: app.get("env"),
        // url: `${SERVER_URL}`,
        api: NODE_ENV === "production" ? "airwave-airtime-api": "airwave-airtime-sandbox-api"
      }, "Welcome to Airwave airtime API"));
  }
);

export { home };
