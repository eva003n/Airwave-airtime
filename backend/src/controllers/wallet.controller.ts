import { africasTalkingClient } from "../config/africas-talking/africas-talking.js";
import { AFRICAS_TALKING_USERNAME } from "../config/env.js";
import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import type { ATWallet } from "../middlewares/validators/validators.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import { getCurrency } from "../utils/index.js";
import logger from "../logger/logger.winston.js";



const createPaymentMethod = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Payment method created successfully")
      );
  }
);
const getWalletBalance = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
 

    const balanceInfo = await reloadlyClient.request<any>("GET", "accounts/balance")

    return res.status(200).json(
        new ApiResponse(200, balanceInfo.data, "Wallet balance fetched successfully")
    )

  }
);

const createWalletThresholds = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
   

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Wallet threshold created successfully"
        )
      );
  }
);

const createAutoReacharge = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Wallet autorecharge created successfully")
      );
  }
);

/* --- admin only */
// Get africas talking servuce wallet balance
const getATWalletBalance = async () => {
  
    const response = await africasTalkingClient.get<ATWallet>("/version1/user")

    return getCurrency(response.data.userData.balance);
  
}

const getATWalletFloatBallance = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
     
    
  }

)

export {
    createPaymentMethod,
    getWalletBalance,
    createWalletThresholds,
    createAutoReacharge
}