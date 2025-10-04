
import type { ZodIssue } from "zod";
//format the default joi error
const formatError = (errors: ZodIssue[]) => {
  return errors.map((error: ZodIssue) => ({
    detail: error.message,
    field: error.path
  }));

}






export { formatError}; 
