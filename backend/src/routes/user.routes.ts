import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/user.controller.js";
import { IdSchema, userSchema } from "../middlewares/validators/validators.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { privateRoute, protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protectRoute)



/* ---- Admin ----- */
//create user 
router.route("/").post(privateRoute, validate(userSchema), createUser);
//fetch all users
router.route("/").get(privateRoute, getAllUsers);
//update user profile
router.route("/:id").put(validate(IdSchema), validate(userSchema), privateRoute, updateUser);

router.route("/:id").get(validate(IdSchema), privateRoute, getUser);
//delete user
router.route("/:id").delete(validate(IdSchema), deleteUser);

export default router;
