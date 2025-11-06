import { Router, type RequestHandler } from "express";
import {  autoDetectOperator, createBulkTopUps, deleteTopUp, getBulkTopUpStatus, getMnpDetails, getOperators, getTopUps, getTopUpStatus, sendBulkTopUps, sendTopUp, startBulkTopUp, validateTopup,} from "../controllers/topup.controller.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { IdSchema, OperatorDetailsSchema, paginateSchema, recipientQuerySchema, topUpSchema } from "../middlewares/validators/validators.js";
import { uploadSingleFile } from "../middlewares/multer.middleware.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router()


// callback urls called by africas talking
router.route("/validate").post(validateTopup)
router.route("/status").post(getTopUpStatus)


//protect route from unauthorized access
router.use(protectRoute)



//Enable single topups
router.route("/").get(validate(recipientQuerySchema), getTopUps);
//Perform single top up
router.route("/").post(validate(topUpSchema), sendTopUp);

router.route("/:id").delete(validate(IdSchema), deleteTopUp);
//Enable bulk topups
router.route("/bulk/:id").post(validate(IdSchema), uploadSingleFile("recipients"), createBulkTopUps)

//start bulk top up
router.route("/bulk").get(startBulkTopUp)
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

//Get real time status for bulk top ups
router.route("/progress/:id").get(validate(IdSchema), getBulkTopUpStatus)



export default router;