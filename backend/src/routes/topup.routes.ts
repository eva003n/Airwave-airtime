import { Router, type RequestHandler } from "express";
import { bulkTopUps, getTopUps, singleTopUp } from "../controllers/topup.controller.js";

const router = Router()

//Enable single topups
router.route("/").get(getTopUps);
//Perform single top up
router.route("/top-up").post(singleTopUp);
//Enable bulk topups
router.route("/bulk").post(bulkTopUps)



export default router;