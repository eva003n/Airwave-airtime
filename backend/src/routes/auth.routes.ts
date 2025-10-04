import { Router } from "express";
import { signIn, signOut, signUp, tokenRefresh } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { signInSchema, signUpSchema } from "../middlewares/validators/validators.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/sign-up").post(validate(signUpSchema), signUp);
router.route("/sign-in").post(validate(signInSchema), signIn);
router.route("/sign-out").delete(protectRoute, signOut);
router.route("/refresh-token").get(tokenRefresh);

export default router;
