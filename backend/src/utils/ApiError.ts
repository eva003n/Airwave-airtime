//HTTP APi Problem details RFC spec
/*
 * https://datatracker.ietf.org/doc/html/rfc7807
 * https://www.rfc-editor.org/rfc/rfc9457.html
 
 */

import { API_DOC_URI } from "../config/env.js";
//standadize error response
class ApiError extends Error {
  type: string;
  status: number;
  title: string | undefined;
  success: boolean;
  override message: string;
  errors: string | object[] | null;
  instance: string;

  
  constructor(
    type: string,
    title: string,
    statusCode: number = 500,
    errors: string | object[] | null = null,
    message: string = "Something went wrong",
    instance: string,
  ) {

    // pevent generating stack trace twice(Optimization)
    const { stackTraceLimit} = Error;// 10 
    
    Error.stackTraceLimit = 0;
    super();// no stack trace generated
    Error.stackTraceLimit = stackTraceLimit;

    this.type = type ? `${API_DOC_URI}/${type}` : "about:blank";
    this.title = title;
    this.status = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.instance = instance;

    
    if(!this.stack) {
      //captures the stack trace manually from when this object is created and sets it to the stack property for instance of ApiError
      Error.captureStackTrace(this, this.constructor);
    }


  }
  // static method to create a new instance of ApiError

  static badRequest(
    statusCode: number,
    instance: string,
    message: string = "Bad Request",
    errors: object[] | null | any = null,
    type: string = "probs/validation-error",
    title: string = "Validationerrors"
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }

  static unAuthorizedRequest(
    statusCode: number,
    instance: string,
    message: string = "Unauthorized request",
    errors: string | object[] | null = null,
    type: string = "probs/unauthorized-error",
    title: string = "Unauthorized request"
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }
  static conflictRequest(
    statusCode: number,
    instance: string,
    message: string = "Conflict request",
    errors: string | object[] | null = null,
    type: string = "probs/conflict-error",
    title: string = "Conflict request"
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }
  static notFound(
    statusCode: number,
    instance: string,
    message: string = "Not Found",
    errors: string | object[] | null = null,
    type: string = "probs/not-found-error",
    title: string = "ResourceNotFoundError"
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }

  static unprocessable(
    statusCode: number,
    instance: string,
    message: string = "Unprocessable content",
    errors: string | object[] | null = null,
    type: string = "probs/unprocessable-error",
    title: string = "UnprocessableError"
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }
  static tooManyRequest(
    statusCode: number,
    instance: string,
    message: string = "Too many requests",
    errors: string | object[] | null = null,

    type: string = "probs/too-many-request-error",
    title: string = "TooManyRequestError"
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }
  static forbiddenRequest(
    statusCode: number,
    instance: string,
    message: string = "Forbidden request",
    errors: string | object[] | null = null,
    type: string = "probs/forbidden-error",
    title: string = "ForbiddenError"
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }
  static internalServerError(
    statusCode: number = 500,
    instance: string,
    message: string = "Something went wrong",
    errors: object[] | null | any = null,
    type: string = "probs/internal-error",
    title: string = "InternalError"
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }

  static serviceUnavavilable(
    statusCode: number = 503,
    instance: string,
    message: string = "Service unavailable, try again later",
    errors: object[] | null | any = null,
    type: string = "probs/unavailable-error",
    title: string = "UnaavailableError"
  ) {
    return new ApiError(type, title, statusCode, errors, message, instance);
  }
}

export default ApiError;
