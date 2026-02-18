import type {
    BulkRecipientData,
  FilterOptions,
  RecipientData,
} from "../middlewares/validators/validators.js";
import Recipient from "../models/Recipient.js";
import type User from "../models/User.js";

const createNewRecipient = async (recipient: RecipientData, user: User) => {
  const isRecipient = await Recipient.findOne({
    where: { phone_number: recipient.phone_number },
  });

  if (!isRecipient) return { recipient: isRecipient, newRecipient: null };

  const newRecipient = await Recipient.create({
    name: recipient.name,
    operator: recipient.operator,
    // operator_code: operatorCode,
    designation: recipient.designation,
    branch: recipient.branch,
    airtime_amount: recipient.airtime_amount,
    phone_number: recipient.airtime_amount,
    user_id: user.id,
  });

  return { recipient: isRecipient, newRecipient };
};

const updateExistingRecipient = async (
  id: string,
  recipient: RecipientData,
) => {
  // const operatorCode = operator === "Safaricom" ? 266 : 265;

  const isRecipient = await getSingleRecipient(id);
  if (!isRecipient) return { oldRecipient: isRecipient, newRecipient: null };

  //update serveral fields at once
  isRecipient.set({
    name: recipient.name,
    operator: recipient.operator,
    phone_number: recipient.phone_number,
    airtime_amount: recipient.airtime_amount,
    designation: recipient.designation,
    branch: recipient.branch,
    department: recipient.department,
  });
  // isRecipient.name = name;
  // isRecipient.operator = operator;
  // isRecipient.phone_number = phone_number;
  // isRecipient.airtime_amount = airtime_amount;
  // isRecipient.designation = designation;
  // isRecipient.operator_code = operatorCode;
  // isRecipient.branch = branch;

  const updatedRecipient = await isRecipient.save();

  return { oldRecipient: isRecipient, newRecipiemt: updatedRecipient };
};

const deleteExistingRecipient = async (id: string) => {
  const isRecipient = await Recipient.findByPk(id);
  if (!isRecipient) return isRecipient;

  await Recipient.destroy({ where: { id } });

  return isRecipient;
};

const getSingleRecipient = async (id: string) => {
  const isRecipient = await Recipient.findByPk(id);
   return isRecipient;
};

const createBulkRecipeents = async (recipients: BulkRecipientData) => {
  //check for duplicates
  const existingRecipients = await Recipient.findAll();

  const isDuplicate = existingRecipients.filter((recipient) => {
    return recipients.filter(
      (newRecipient: RecipientData): boolean =>
        recipient.phone_number === newRecipient.phone_number,
    );
  });

  // if (!isDuplicate.length)
  //   return next(
  //     ApiError.conflictRequest(
  //       409,
  //       req.originalUrl,
  //       "Failed to create duplicate recipients"
  //     )
  //   );

  const newReipients = await Recipient.bulkCreate(recipients);
  return newReipients;
};
const getPaginatedRecipients = async (filtersOptions: FilterOptions) => {
  //inplements page by page logic
  const offset = (filtersOptions.page - 1) * filtersOptions.limit;

  //build an object of dynamic filters
  const filters = {
    branch: filtersOptions.branch,
    department: filtersOptions.department,
    name: filtersOptions.name,
  };

  //convert resulting array to object for filtering
  const where = Object.fromEntries(
    //build an array of key value pairs removing empty values
    Object.entries(filters).filter(([_, v]) => v?.toString().trim()),
  );

  const { rows, count } = await Recipient.findAndCountAll({
    where,
    limit: filtersOptions.limit,
    offset,
    order: [["createdAt", "DESC"]],
    // attributes: { exclude: ["user_id"] },
    // group: [[branch, department]],
  });

  return {
    recipients: rows,
    currentPage: filtersOptions.page,
    totalPages: Math.ceil(count / filtersOptions.limit),
    totalItems: count,
  };
};
export {
  createNewRecipient,
  createBulkRecipeents,
  updateExistingRecipient,
  deleteExistingRecipient,
  getSingleRecipient,
  getPaginatedRecipients,
};
