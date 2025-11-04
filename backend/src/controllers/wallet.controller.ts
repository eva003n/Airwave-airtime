import { africasTalkingClient } from "../config/africas-talking/africas-talking.js";
import { AFRICAS_TALKING_USERNAME } from "../config/env.js";
import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import type { ATWallet, Id, WalletType } from "../middlewares/validators/validators.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import { getCurrency } from "../utils/index.js";
import logger from "../logger/logger.winston.js";
import Wallet from "../models/Wallet.js";
import ApiError from "../utils/ApiError.js";



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

     const wallet = await Wallet.findOne({ where: { user_id: id } });
     const balance = Number(wallet?.balance) || 0;



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

    return getCurrency(response.data.userData.balance);
  
}

const getATWalletFloatBallance = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
     
    
  }

)

const updateWallet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const {wallet_type, userId, lower_threshold, upper_threshold }: WalletType = req.body 
    
    const wallet = await Wallet.findOne({where: {user_id: userId}})

    if(!wallet) return next(ApiError.notFound(404, req.originalUrl, "Wallet does not exist"))

    wallet.set({
      wallet_type,
      lower_threshold,
      upper_threshold
    })
    const updatedWallet = await wallet.save()

    return res.status(201).json(new ApiResponse(201, updatedWallet, "Wallet updated sucessfully"))

  }

)
export {
    createPaymentMethod,
    getWallet,
    createWalletThresholds,
    createAutoReacharge,
    updateWallet,
}