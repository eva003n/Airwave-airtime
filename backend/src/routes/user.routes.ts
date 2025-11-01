import { Router } from "express";
import { getUser, updateUser } from "../controllers/user.controller.js";
import { IdSchema } from "../middlewares/validators/validators.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protectRoute)
//fetch all users
router.route("/").get(getUser);
//update user profile
router.route("/:id").put(validate(IdSchema), updateUser);
//create user profile
router.route("/").post(getUser);
//reset user password
router.route("/:id/reset-password").patch(getUser);
//delete user
router.route("/:id").delete(getUser);

export default router;
