import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { formatError } from "../../utils/index.js";
import { z } from "zod";
const validate = (schema) => asyncHandler(async (req, res, next) => {
    // const {error } = schema.safeParse(req.params || req.query)
    const { error } = schema.safeParse(Object.assign({}, req.body, req.params, req.query));
    //validation error exit with bad request
    if (error)
        return next(ApiError.badRequest(400, req.originalUrl, "Invalid input", formatError(error.issues)));
    //validation success move to next function in the stack
    next();
});
export { validate };
