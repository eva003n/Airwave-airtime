import { Router } from "express";
import { getAnalytics } from "../controllers/reports.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router()

//protect route with auth middleware
router.use(protectRoute)

//get analytics
router.route("/").get(getAnalytics)

export default router