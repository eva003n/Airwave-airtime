import { Router } from "express";
import { createAutoReacharge, createPaymentMethod, createWalletThresholds, getWallet, updateWallet } from "../controllers/wallet.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { IdSchema, walletUpdateSchema } from "../middlewares/validators/validators.js";
import { validate } from "../middlewares/validators/validator.middleware.js";

const router = Router()
router.use(protectRoute)

// add payment method
router.route("/").post(createPaymentMethod)

router.route("/").put(validate(walletUpdateSchema), updateWallet)
// look up wallet balance
router.route("/:id").get(validate(IdSchema), getWallet)
// enable auto recharge functionality
router.route("/balance/auto-recharge").get(createAutoReacharge)
//get set wallet thresholds
router.route("/balance/threshold").post(createWalletThresholds)



export default router