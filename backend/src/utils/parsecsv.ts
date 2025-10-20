import csvParser from "csv-parser";
import logger from "../logger/logger.winston.js";
import fs from "fs";
import {
  topUpCsvSchema,
  type BulkTopUpData,
} from "../middlewares/validators/validators.js";
import ApiError from "./ApiError.js";
import type { NextFunction } from "express";

const OPERATOR_CODE_MAP: Record<string, number> = {
  Safaricom: 266,
  Airtel: 265,
};

const parseCsv = async (filePath: string): Promise<BulkTopUpData[]> => {
  return new Promise((resolve, reject) => {
    const results: BulkTopUpData[] = [];
    return fs
      .createReadStream(filePath)
      .pipe(
        csvParser({
          mapHeaders: ({ header }) => header.trim().replace(/^['"]|['"]$/g, ""), // removes quotes + spaces
        })
      )
      .on("data", (data: any, row: any) => {
        // const { error } = topUpCsvSchema.safeParse(data);

        // if (error) {
        //   return next(
        //     ApiError.unprocessable(
        //       422,
        //       "/api/v1/top-ups/bulk",
        //       "Failed to parse the csv ",
        //       error.issues
        //     )
        //   );
        // }

        const operator = data.operator;
        data.operator_code = OPERATOR_CODE_MAP[operator] || 266; //default to safaricom
        results.push(data);
      })
      .on("end", () => resolve(results))
      .on("error", (error) => logger.error(error.message));
  });
};

export default parseCsv;
