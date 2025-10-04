import { Router } from "express";
import { getUser } from "../controllers/user.controller.js";

const router = Router();

//fetch all users
router.route("/").get(getUser);
//update user profile
router.route("/:id").put(getUser);
//create user profile
router.route("/").post(getUser);
//reset user password
router.route("/:id/reset-password").patch(getUser);
//delete user
router.route("/:id").delete(getUser);

export default router;
