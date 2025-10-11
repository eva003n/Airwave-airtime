import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
const getTransactionHistory = asyncHandler(async (req, res, next) => {
    const transactionHistory = await reloadlyClient.request("GET", "/topups/reports/transactions");
    return res.status(200).json(new ApiResponse(200, transactionHistory.data, "Transaction history fetched successfully"));
});
const getTransactionDetails = asyncHandler(async (req, res, next) => {
    const { transactionId } = req.params;
    const transactionDetails = await reloadlyClient.request("GET", `/topups/reports/transactions/${transactionId}`);
    return res.status(200).json(new ApiResponse(200, transactionDetails.data, "Transaction detail fetched successfully"));
});
export { getTransactionHistory, getTransactionDetails };
