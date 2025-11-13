import type { Request, Response, NextFunction } from "express";

import asyncHandler from "../utils/asyncHandler.js";

const getStream = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.query.id as string

        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")
        res.flushHeaders()

    }

)

export {
    getStream
}