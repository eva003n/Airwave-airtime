class ThirdPartyServiceError extends Error {
    status: number
    url: string
    reason: any
    constructor(url: string, reason: any, status: number, stack = "") {
      // prevent generating stack trace twice
      const {stackTraceLimit} = Error;
      Error.stackTraceLimit = 0;
      super()  
      Error.stackTraceLimit = stackTraceLimit

      this.status = status
      this.reason = reason
      this.url = url
      this.stack = stack

      if (stack) {
        this.stack = stack;
      } else {
        //captures the stack trace manually from when this object is created and sets it to the stack property for instance of serviceError
        Error.captureStackTrace(this, this.constructor);
      }

    }
}

export default ThirdPartyServiceError;