import { Router } from "express";
import { getAnalytics } from "../controllers/reports.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { IdSchema } from "../middlewares/validators/validators.js";
import { validate } from "../middlewares/validators/validator.middleware.js";

const router = Router()

//protect route with auth middleware
router.use(protectRoute)

//get analytics
router.route("/:id").get(validate(IdSchema), getAnalytics)

export default router