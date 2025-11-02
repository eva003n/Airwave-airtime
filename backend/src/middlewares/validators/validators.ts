import { minLength, object, string, z } from "zod";
import { MobileOperator } from "../../models/Recipient.js";
import {
  KUNITY_BRANCHES,
  KUNITY_DEPARTMENTS,
  OPERATORS,
} from "../../constants.js";

const signUpSchema = z.object({
  userName: z
    .string()
    .min(5, "Username must be at least 5 characters long")
    .max(50),
  email: z.email("Ibvalid email provided"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(30),
});

const signInSchema = z.object({
  userName: z
    .string()
    .min(5, "Username must be at least 5 characters long")
    .max(50),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(30),
});

//validate top up requests
const topUpSchema = z.object({
  airtime_amount: z
    .number()
    .min(5, "Top up cannot be below 5 ksh")
    .max(10000, "Top up cannot exceed 10,000 ksh"),
  // operator_code: z
  //   .number()
  //   .refine((val) => val == 265 || val == 266, {
  //     message: "Operator code supported are either 265 or 266",
  //   })
  //   .default(266),
  phone_number: z
    .string()
    .regex(
      /^2547\d{8}$/,
      "Phone number must start with 2547 and be 12 digits long"
    ),
  operator: z
    .enum(Object.values(MobileOperator), {
      message: "Invalid operator, only 'safaricom' or 'Airtel' are allowed",
    })
    .optional(),
});

const isoDateString = z.preprocess((arg) => {
  if (!arg) return undefined;
  if (typeof arg === "string") return arg;
  if (arg instanceof Date) return arg.toISOString();
  if (typeof (arg as any)?.toISOString === "function")
    return (arg as any).toISOString();
  return undefined;
}, z.string().optional());

const topUpCsvSchema = z.object({
  id: z.uuid().optional(),
  name: z.string({ message: "Name is required" }),
  phone: z
    .string()
    .regex(
      /^2547\d{8}$/,
      "Phone number must start with 2547 and be 12 digits long"
    ),
  amount: z
    .transform(Number)
    .pipe(
      z
        .number()
        .min(5, "Minimum airtime topup is KES 5")
        .max(10000, "Maximum topup is KES 10,000")
    ),
  branch: z.enum(KUNITY_BRANCHES, { message: "Branch is required" }),
  operator: z.enum(OPERATORS, {
    message: "Operator is required",
  }),
  operator_code: z
    .transform(Number)
    .pipe(z.number().min(265).max(266))
    .optional(),
  status: z
    .enum(["Pending", "Processing", "Failed", "Completed", "Success"])
    .optional(),
  error: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// const topUpCsvSchema = z.object({
//   id: z.uuid().optional(),
//   name: z.string("Name is required"),
//   phone: z
//     .string()
//     .regex(
//       /^2547\d{8}$/,
//       "Phone number must start with 2547 and be 12 digits long"
//     ),
//   amount: z
//     .transform(Number) //converts the type to a number
//     .pipe(
//       //revalidates it as a number
//       z
//         .number({ error: "Invalid input, not a number" })
//         .min(5, "Minimum airtime topup is KES 5")
//         .max(10000, "Maximum topup is KES 10,000")
//     ), // ensures it's typed properly
//   branch: z
//     .enum(KUNITY_BRANCHES)
//     .refine((val) => !!val, { message: "Branch is required" }),
//   operator: z
//     .enum(["Safaricom", "Airtel"] as const)
//     .refine((val) => !!val, { message: "Operator is required" }),

//   operator_code: z
//     .transform(Number)
//     .pipe(
//       z
//         .number({ error: "Invalid input, not a number" })
//         .min(265, "Minimum operator code is 265")
//         .max(266, "Minimum operator code is 266")
//     )
//     .optional(),
//   status: z
//     .enum(["Pending", "Processing", "Failed", "Completed", "Success"])
//     .optional(),
//   error: z.string().optional(),
//   createdAt: z.preprocess((arg) => {
//     // Accept ISO strings, Date instances, or any object that has a toISOString() method
//     if (typeof arg === "string") return arg;
//     if (arg instanceof Date) return arg.toISOString();
//     if (arg && typeof (arg as any).toISOString === "function")
//       return (arg as any).toISOString();
//     return undefined;
//   }, z.string().optional()), // ISO string for Day.js
//   updatedAt: z.preprocess((arg) => {
//     if (typeof arg === "string") return arg;
//     if (arg instanceof Date) return arg.toISOString();
//     if (arg && typeof (arg as any).toISOString === "function")
//       return (arg as any).toISOString();
//     return undefined;
//   }, z.string().optional()),
// });
// const bulkTopUpDataSchema = topUpCsvSchema

const operatorDetailsSchemaApi = z.object({
  operatorId: z.number(),
  name: z.string(),
});
const reloadlyTopResponseSchema = z.object({
  transactionId: z.number(),
  recipientPhone: z.string(),
  operatorId: z.number(),
  status: z.string(),
  deliveredAmount: z.number(),
});
const IdSchema = z.object({
  id: z
    .uuid()
    .refine(
      (val) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          val
        ),
      { message: "ID must be  valid" }
    ),
});

const OperatorDetailsSchema = z.object({
  phone_number: z.string().min(12).max(12),
  countryIsoCode: z.string().min(2).max(2).default("KE"),
});

//validate access token
const tokenSchema = z.jwt({ alg: "HS256" });

const recipientSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must not exceed 100 characters"),

  branch: z.enum(
    [
      "Head office",
      "Kiambu",
      "Limuru",
      "Githunguri",
      "Kiriita",
      "Kagwe",
      "Kikuyu",
      "Wangige",
      "Banana",
      "Mai mahiu",
      "Suswa",
      "Gikomba",
      "Ruaka",
      "Wakimbo",
      "Gikambura",
      "Nairekia",
    ],
    { error: "Branch is required" }
  ),

  phone_number: z
    .string()
    .regex(
      /^2547\d{8}$/,
      "Phone number must start with 2547 and be 12 digits long"
    ),

  operator: z.enum(Object.values(MobileOperator)),

  // operator_code: z
  // .coerce
  //   .number()

  //   .refine((val) => [265, 266].includes(val), {
  //     message: "Operator code must be one of 265 or 266",
  //   }),

  airtime_amount: z.coerce
    .number("Invalid input not a number")
    .min(5, "Minimum airtime topup is KES 5")
    .max(10000, "Maximum topup is KES 10,000"),

  designation: z
    .string()
    .min(3, "Designation must be at least 3 characters long")
    .max(50, "Designation too long"),
  user_id: z.uuidv4(),
  department: z.enum(KUNITY_DEPARTMENTS, { error: "Department is required" }),
});

const recipientQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  department: z.string().optional(),
  branch: z.string().optional(),
  name: z.string().optional(),
});
const cookieSchema = z.object({
  AccessToken: z.string().optional(),
  RefreshToken: z.string(),
});

const multipleRecipientSchema = z.array(recipientSchema).min(1).max(100);

const paginateSchema = z.object({
  page: z.coerce.number({ error: "Page is not a number" }),
  limit: z.coerce.number({ error: "Limit is not a number" }),
});

const walletBalanceSchema = z.object({
  balance: z.number(),
  currencyCode: z.string(),
  currencyName: z.string(),
  updatedAt: z.date(),
  lowBalanceThreshold: z.number(),
  maxLowBalanceThreshold: z.number(),
});
const africasTalkingWalletBalanceSchema = z.object({
data: z.object({
  userData: z.object({
    balance: z.string()
  })
})
});

const AfricasTalkingTopUpSchema = z.object({
  responses: z.array(
    z.object({
      requestId: z.string(),
      phoneNumber: z.string(),
      status: z.string(),
      amount: z.string(),
    })
  ),
});

const mpesaC2BApiResponseSchema = z.object({
  BillRefNumber: z.string(),
  BusinessShortCode: z.string(),
  TransID: z.string().optional(),
  TransAmount: z.string().optional(),
  TransactionType: z.string().optional(),
  ThirdPartyTransID: z.string().optional()
});

//covert from zod types to typescript types
export type SignUpAuth = z.infer<typeof signUpSchema>;
export type SignInAuth = z.infer<typeof signInSchema>;
export type Token = z.infer<typeof tokenSchema>;
export type TopUp = z.infer<typeof topUpSchema>;
export type Id = z.infer<typeof IdSchema>;
export type OperatorDatail = z.infer<typeof OperatorDetailsSchema>;
export type RecipientData = z.infer<typeof recipientSchema>;
export type BulkRecipientData = z.infer<typeof multipleRecipientSchema>;
export type PaginateData = z.infer<typeof paginateSchema>;
export type BulkTopUpData = z.infer<typeof topUpCsvSchema>;
export type CookieData = z.infer<typeof cookieSchema>;
export type RecipientQueryData = z.infer<typeof recipientQuerySchema>;

//reloadly api response types
export type ReloadlyTopUp = z.infer<typeof reloadlyTopResponseSchema>;
export type OperatorDetailApi = z.infer<typeof operatorDetailsSchemaApi>;
export type WalletBalance = z.infer<typeof walletBalanceSchema>;
export type ATTopUpResponse = z.infer<typeof AfricasTalkingTopUpSchema>;
export type ATWallet = z.infer<typeof africasTalkingWalletBalanceSchema>

// Mpesa api response type
export type MpesaC2BResponse = z.infer<typeof mpesaC2BApiResponseSchema>;
export {
  signUpSchema,
  signInSchema,
  tokenSchema,
  topUpSchema,
  IdSchema,
  OperatorDetailsSchema,
  recipientSchema,
  recipientQuerySchema,
  paginateSchema,
  multipleRecipientSchema,
  topUpCsvSchema,
  cookieSchema,
  walletBalanceSchema,
  mpesaC2BApiResponseSchema,

};
