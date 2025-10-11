import { Router } from "express";
import { getTransactionHistory } from "../controllers/transactions.controller.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { IdSchema } from "../middlewares/validators/validators.js";
const router = Router();
//get transaction histrory
router.route("/history").get(getTransactionHistory);
//get transaction details  fro a topup
router.route("/:transactionId").get(validate(IdSchema), getTransactionHistory);
export default router;
