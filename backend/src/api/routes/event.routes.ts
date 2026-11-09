import { Router } from "express";
import { getStream } from "../controllers/event.controller.js";

const router = Router()

router.route("/").get(getStream)

export default router