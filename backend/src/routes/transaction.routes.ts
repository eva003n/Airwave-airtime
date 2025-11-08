import { Router } from "express";
import { deleteTransaction, getTransactionHistory, getTransactions } from "../controllers/transactions.controller.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { IdSchema } from "../middlewares/validators/validators.js";
import { privateRoute, protectRoute } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(protectRoute)

//get transaction histrory
router.route("/admin").get(privateRoute, getTransactionHistory)
router
  .route("/admin/:id")
  .delete(validate(IdSchema), privateRoute, deleteTransaction);

router.route("/").get(getTransactions)

//get transaction details  fro a topup
router.route("/:transactionId").get(validate(IdSchema), getTransactionHistory)
export default router;