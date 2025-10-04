import { Router } from "express";
import { createAutoReacharge, createPaymentMethod, createWalletThresholds, getWalletBalance } from "../controllers/wallet.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(protectRoute)

// add payment method
router.route("/").post(createPaymentMethod)
// look up wallet balance
router.route("/balance").get(getWalletBalance)
// enable auto recharge functionality
router.route("/balance/auto-recharge").get(createAutoReacharge)
//get set wallet thresholds
router.route("/balance/threshold").post(createWalletThresholds)



export default router