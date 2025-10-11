import ApiError from "../utils/ApiError.js";
import logger from "../logger/logger.winston.js";
import { MulterError } from "multer";
const errorHandlerMiddleware = async (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.type("application/problem+json").status(err.status).json(err);
    }
    else if (err instanceof MulterError) {
        return res.type("application/problem+json").status(400).json(ApiError.badRequest(400, req.originalUrl, `${err.message}, ${err.field} field is required `));
    }
    else {
        logger.error(err.message);
        console.dir(err);
        return res
            .type("application/problem+json")
            .status(500)
            .json(ApiError.internalServerError(500, req.originalUrl));
    }
};
export default errorHandlerMiddleware;
