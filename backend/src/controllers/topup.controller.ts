import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";

const getTopUps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

const bulkTopUps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}

)
const singleTopUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}

)

export { singleTopUp, bulkTopUps, getTopUps };
