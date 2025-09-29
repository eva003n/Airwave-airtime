import { Router } from "express";
import { createRecipient } from "../controllers/recipient.controller.js";

const router = Router();

//create an airtime recipient
router.route("/").post(createRecipient)
//update an airtime recipient
router.route("/:id").put(createRecipient)
//delete an airtime recipient
router.route("/:id").delete(createRecipient)
//upload recipients list in CVS or excel format
router.route("/recipient-list").post(createRecipient)
//get all airtime recipients by search, filter
router.route("/").get(createRecipient)

export default router;
