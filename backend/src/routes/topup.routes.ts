import { Router, type RequestHandler } from "express";
import {  getTopUps, getTopUpStatus, sendBulkTopUps, sendTopUp,} from "../controllers/topup.controller.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { IdSchema, topUpSchema } from "../middlewares/validators/validators.js";

const router = Router()

//Enable single topups
router.route("/").get(getTopUps);
//Perform single top up
router.route("/").post(validate(topUpSchema), sendTopUp);
//Enable bulk topups
router.route("/bulk").post(sendBulkTopUps)
//get top status
router
  .route("/:transactionId/status")
  .get(validate(IdSchema), getTopUpStatus);



export default router;