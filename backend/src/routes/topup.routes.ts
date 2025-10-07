import { Router, type RequestHandler } from "express";
import {  autoDetectOperator, getMnpDetails, getOperators, getTopUps, getTopUpStatus, sendBulkTopUps, sendTopUp,} from "../controllers/topup.controller.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { IdSchema, OperatorDetailsSchema, topUpSchema } from "../middlewares/validators/validators.js";
import { uploadSingleFile } from "../middlewares/multer.middleware.js";

const router = Router()

//Enable single topups
router.route("/").get(getTopUps);
//Perform single top up
router.route("/").post(validate(topUpSchema), sendTopUp);
//Enable bulk topups
router.route("/bulk").post(uploadSingleFile("recipient"), sendBulkTopUps)
//get top status
router
  .route("/:transactionId/status")
  .get(validate(IdSchema), getTopUpStatus);

//auto-detect phone number operator
router.route("/operators/autodetect").post(validate(OperatorDetailsSchema), autoDetectOperator)
//get operators via a countries iso code
router.route("/operators").get(getOperators)
//ensure successful delivery of topups to the right carrier based on carrier
router.route("/operators/mnp-lookup").get(validate(OperatorDetailsSchema), getMnpDetails)



export default router;