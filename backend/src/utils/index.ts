
import type { ZodIssue } from "zod";
//format the default joi error
const formatError = (errors: ZodIssue[]) => {
  return errors.map((error: ZodIssue) => ({
    detail: error.message,
    field: error.path
  }));

}


const getCurrency = (currency: string): number => {
  return parseInt(parseInt(currency.replace("KES", "").trim()).toFixed(2));

}



export { formatError, getCurrency}; 
