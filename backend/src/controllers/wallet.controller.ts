import { africasTalkingClient } from "../config/africas-talking/africas-talking.js";
import type { ATWallet, Id, WalletType } from "../middlewares/validators/validators.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import { getCurrency } from "../utils/index.js";
import logger from "../logger/logger.winston.js";
import Wallet from "../models/Wallet.js";
import ApiError from "../utils/ApiError.js";
import { editWallet, findWallet } from "../services/wallet.service.js";



const createPaymentMethod = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Payment method created successfully")
      );
  }
);
const getWallet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
 
    const {id} = req.params as Id

    const wallet = await findWallet(id)

    if(!wallet) return next(ApiError.notFound(404, req.originalUrl, "Wallet does not exists"))

    return res.status(200).json(
        new ApiResponse(200, wallet, "Wallet balance fetched successfully")
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

    return getCurrency(response.data.UserData.balance);
  
}

const getATWalletFloatBallance = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
     
    
  }

)

const updateWallet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params as Id;

    const {wallet_type, userId, lower_threshold, upper_threshold }: WalletType = req.body 
    
    const wallet = await editWallet(id, {wallet_type: wallet_type as string, lower_threshold: lower_threshold as number, upper_threshold: upper_threshold as number}, req.user.id);

    if (!wallet)
      return next(
        ApiError.notFound(404, req.originalUrl, "Wallet does not exist"),
      );

    return res.status(201).json(new ApiResponse(201, wallet, "Wallet updated sucessfully"))

  }

)
export {
    createPaymentMethod,
    getWallet,
    createWalletThresholds,
    createAutoReacharge,
    updateWallet,
}