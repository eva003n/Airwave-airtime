import { Router } from "express";
import { privateRoute, protectRoute } from "../middlewares/auth.middleware.js";
import { getLedgers } from "../controllers/ledger.controller.js";

const router = Router()

router.use(protectRoute)

router.route("/admin").get(privateRoute, getLedgers)
export default router