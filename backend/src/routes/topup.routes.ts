import { Router, type RequestHandler } from "express";
import { getTopUps } from "../controllers/topup.controller.js";

const router = Router()

//Enable single topups
router.route("/").post(getTopUps);

//Enable bulk topups
router.route("/bulk").post(getTopUps)



export default router;