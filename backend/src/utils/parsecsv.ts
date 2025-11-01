import csvParser from "csv-parser";
import logger from "../logger/logger.winston.js";
import fs from "fs";
import {
  topUpCsvSchema,
  type BulkTopUpData,
} from "../middlewares/validators/validators.js";
import ApiError from "./ApiError.js";
import type { NextFunction } from "express";
import { randomUUID } from "crypto";

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
      .on("data", async(data: BulkTopUpData, row: any) => {

        const operator = data.operator;
        data.operator_code = OPERATOR_CODE_MAP[operator] || 266; //default to safaricom
        data.status = "Pending"
        data.createdAt = new Date().toISOString()
        data.updatedAt = new Date().toISOString()
        data.id = randomUUID()

       
        results.push(data);

        //  await pub.publish(
        //    "topup_updates",
        //    JSON.stringify({
        //      ...data,
             
        //    })
        //  );
      })
      .on("end", () => resolve(results))
      .on("error", (error) => logger.error(error.message));
  });
};

export default parseCsv;
