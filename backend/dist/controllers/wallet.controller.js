import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
const createPaymentMethod = asyncHandler(async (req, res, next) => {
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Payment method created successfully"));
});
const getWalletBalance = asyncHandler(async (req, res, next) => {
    const balanceInfo = await reloadlyClient.request("GET", "accounts/balance");
    return res.status(200).json(new ApiResponse(200, balanceInfo.data, "Wallet balance fetched successfully"));
});
const createWalletThresholds = asyncHandler(async (req, res, next) => {
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Wallet threshold created successfully"));
});
const createAutoReacharge = asyncHandler(async (req, res, next) => {
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Wallet autorecharge created successfully"));
});
export { createPaymentMethod, getWalletBalance, createWalletThresholds, createAutoReacharge };
