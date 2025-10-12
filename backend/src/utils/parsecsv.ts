import csvParser from "csv-parser";
import logger from "../logger/logger.winston.js";
import fs from "fs"
import type { BulkTopUpData } from "../middlewares/validators/validators.js";
const  parseCsv = async (filePath: string): Promise<BulkTopUpData> => {
  return new Promise((resolve, reject) => {
    const results: BulkTopUpData = [];
    return fs
      .createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data: any) => results.push(data))
      .on("end",  () => resolve(results))
      .on("error", (error) => logger.error(error.message))
  });
};

export default parseCsv