import { Router } from "express";
import { getWalletBalance } from "../controllers/wallet.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(protectRoute)

router.route("/balance").get(getWalletBalance)
router.route("/deposit")



export default router