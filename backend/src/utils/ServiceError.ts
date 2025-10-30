class ThirdPartyServiceError extends Error {
    status: number
    url: string
    reason: string
    constructor(url: string, reason: string, status: number, stack = "") {
      super()  
      this.status = status
      this.reason = reason
      this.url = url
      this.stack = stack

      if (stack) {
        this.stack = stack;
      } else {
        //captures the stack trace vand sets it to the ApiError stack property
        Error.captureStackTrace(this, this.constructor);
      }

    }
}

export default ThirdPartyServiceError;