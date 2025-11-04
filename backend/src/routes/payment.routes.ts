import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { receivePayment, receivePaymentConfirmation, registerC2BUrl, validatePayment } from "../controllers/payments.controller.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { mpesaC2BApiResponseSchema } from "../middlewares/validators/validators.js";

const router = Router()

// router.use(protectRoute)

// Recieve payments from a customer
router.route("/paybill/validate-payment").post( validatePayment)
router.route("/paybill/confirm-payment").post( receivePaymentConfirmation)
router.route("/register-C2B").post(receivePayment)

export default router;