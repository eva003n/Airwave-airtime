import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { receivePaymentConfirmation, registerC2BUrl, validatePayment } from "../controllers/payments.controller.js";

const router = Router()

router.use(protectRoute)

// Recieve payments from a customer
router.route("/mpesa/validate-payment").post(validatePayment)
router.route("/mpesa/confirm-payment").post(receivePaymentConfirmation)
router.route("/register-C2B").post(registerC2BUrl)

export default router;