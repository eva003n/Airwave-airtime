import type { Request, Response, NextFunction } from "express";

import asyncHandler from "../utils/asyncHandler.js";
import { app } from "../app.js";

const setEnvironment = asyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const mode = req.headers["x-env"] 
        app.set("env", mode)

        return next()
      }
);

export default setEnvironment