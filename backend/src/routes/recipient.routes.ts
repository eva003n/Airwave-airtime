import { Router } from "express";
import { createRecipient, createRecipients, deleteRecipient, getAllrecipients, getRecipient, updateRecipient } from "../controllers/recipient.controller.js";
import { IdSchema, multipleRecipientSchema, paginateSchema, recipientSchema } from "../middlewares/validators/validators.js";
import { validate } from "../middlewares/validators/validator.middleware.js";

const router = Router();

//create an airtime recipient
router.route("/").post(validate(recipientSchema), createRecipient)
//update an airtime recipient
router.route("/:id").put(validate(IdSchema), validate(recipientSchema), updateRecipient)
//delete an airtime recipient
router.route("/:id").delete(validate(IdSchema), deleteRecipient)
//create recipients in bulk
router.route("/bulk").post(validate(multipleRecipientSchema), createRecipients)
//get all airtime recipients by search, filter
router.route("/").get(validate(paginateSchema), getAllrecipients)
router.route("/:id").get(validate(IdSchema), getRecipient)

export default router;
