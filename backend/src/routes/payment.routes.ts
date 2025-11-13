import { Router } from "express";
import { privateRoute, protectRoute } from "../middlewares/auth.middleware.js";
import {receivePaymentStatus, receivePaymentConfirmation, validatePayment, retryMpesaPayment, getMpesaTransactionStatus } from "../controllers/payments.controller.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { mpesaC2BApiResponseSchema, transactionStatus } from "../middlewares/validators/validators.js";

const router = Router()


/* ---- Mpesa service callbacks ---- */
// Recieve payments from a customer
router.route("/paybill/validate-payment").post( validatePayment)
router.route("/paybill/confirm-payment").post( receivePaymentConfirmation)

router.route("/paybill/transaction-status/result").post(receivePaymentStatus)
router.route("/paybill/transaction/timeout").post(retryMpesaPayment)

router.use(protectRoute)
router
  .route("/paybill/transaction-status")
  .post(validate(transactionStatus), privateRoute, getMpesaTransactionStatus);

export default router;