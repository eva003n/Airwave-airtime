import { Router } from "express";
import { createRecipient, createRecipients, deleteRecipient, getAllRecipients, getRecipient, updateRecipient } from "../controllers/recipient.controller.js";
import { IdSchema, multipleRecipientSchema, paginateSchema, recipientQuerySchema, recipientSchema } from "../middlewares/validators/validators.js";
import { validate } from "../middlewares/validators/validator.middleware.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

//protect recipients routes from un authorized access
router.use(protectRoute)

//create an airtime recipient
router.route("/").post(validate(recipientSchema), createRecipient)
//update an airtime recipient
router.route("/:id").put(validate(IdSchema), validate(recipientSchema), updateRecipient)
//delete an airtime recipient
router.route("/:id").delete(validate(IdSchema), deleteRecipient)
//create recipients in bulk
router.route("/bulk").post(validate(multipleRecipientSchema), createRecipients)
//get all airtime recipients
router.route("/").get(validate(recipientQuerySchema), getAllRecipients)
router.route("/:id").get(validate(IdSchema), getRecipient)

export default router;
