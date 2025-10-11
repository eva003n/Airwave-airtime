//HTTP APi Problem details RFC spec
/*
 * https://datatracker.ietf.org/doc/html/rfc7807
 * https://www.rfc-editor.org/rfc/rfc9457.html
 
 */
import { API_DOC_URI } from "../config/env.js";
//standadize error response
class ApiError extends Error {
    type;
    status;
    title;
    success;
    message;
    errors;
    instance;
    constructor(type, title, statusCode = 500, errors = null, message = "Something went wrong", instance, stack = "") {
        super(message);
        this.type = type ? `${API_DOC_URI}/${type}` : "about:blank";
        this.title = title;
        this.status = statusCode;
        this.message = message;
        this.success = false;
        this.errors = errors;
        this.instance = instance;
        if (stack) {
            this.stack = stack;
        }
        else {
            //captures the stack trace vand sets it to the ApiError stack property
            Error.captureStackTrace(this, this.constructor);
        }
    }
    // static method to create a new instance of ApiError
    static badRequest(statusCode, instance, message = "Bad Request", errors = null, type = "probs/validation-error", title = "Validationerrors") {
        return new ApiError(type, title, statusCode, errors, message, instance);
    }
    static unAuthorizedRequest(statusCode, instance, message = "Unauthorized request", errors = null, type = "probs/unauthorized-error", title = "Unauthorized request") {
        return new ApiError(type, title, statusCode, errors, message, instance);
    }
    static conflictRequest(statusCode, instance, message = "Conflict request", errors = null, type = "probs/conflict-error", title = "Conflict request") {
        return new ApiError(type, title, statusCode, errors, message, instance);
    }
    static notFound(statusCode, instance, message = "Not Found", errors = null, type = "probs/not-found-error", title = "ResourceNotFoundError") {
        return new ApiError(type, title, statusCode, errors, message, instance);
    }
    static unprocessable(statusCode, instance, message = "Unprocessable content", errors = null, type = "probs/unprocessable-error", title = "UnprocessableError") {
        return new ApiError(type, title, statusCode, errors, message, instance);
    }
    static tooManyRequest(statusCode, instance, message = "Too many requests", errors = null, type = "probs/too-many-request-error", title = "TooManyRequestError") {
        return new ApiError(type, title, statusCode, errors, message, instance);
    }
    static forbiddenRequest(statusCode, instance, message = "Forbidden request", errors = null, type = "probs/forbidden-error", title = "ForbiddenError") {
        return new ApiError(type, title, statusCode, errors, message, instance);
    }
    static internalServerError(statusCode = 500, instance, message = "Something went wrong", errors = null, type = "probs/internal-error", title = "InternalError") {
        return new ApiError(type, title, statusCode, errors, message, instance);
    }
}
export default ApiError;
