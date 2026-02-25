import { Router } from "express";
import {   createBulkTopUps, deleteTopUp, getBulkTopUpStatus,  getTopUps, getTopUpStatus, sendTopUp, startBulkTopUp, validateTopup,} from "../controllers/topup.controller.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { ATTopUpStatusSchema, IdSchema, OperatorDetailsSchema, paginateSchema, recipientQuerySchema, topUpSchema, validateTopUpATSchema } from "../middlewares/validators/validators.js";
import { uploadSingleFile } from "../middlewares/multer.middleware.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router()


// callback urls called by africas talking
router.route("/top-up/validate").post(validate(validateTopUpATSchema), validateTopup)
router
  .route("/top-up/status")
  .post(validate(ATTopUpStatusSchema), getTopUpStatus);


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



//Get real time status for bulk top ups
router.route("/progress/:id").get(validate(IdSchema), getBulkTopUpStatus)



export default router;