import { KUNITY_BRANCHES, KUNITY_DEPARTMENTS, WALLET_TYPES } from "@/constants";
import { object, z } from "zod";

const signUpSchema = z.object({
  userName: z
    .string()
    .min(5, "Username must be at least 5 characters long")
    .max(50),
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(30)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "At least 1 uppercase,1 lowercase,1 number, 1 special character"
    ),
});

const signInSchema = z.object({
  userName: z
    .string()
    .min(5, "Username must be at least 5 characters long")
    .max(50),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(30, "Password too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "At least 1 uppercase,1 lowercase,1 number, 1 special character"
    ),
});

export const userSchema = z.object({
  id: z
    .uuid()
    .refine(
      (val) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          val
        ),
      { message: "Invalid UUID v4 format" }
    )
    .optional(),
  username: z.string().min(1, "Username is required"),
  email: z.email(),
  role: z.enum(["user", "admin"]), // Adjust roles as needed
  avatar_url: z.string().optional(),
  avatar_id: z.uuid().nullable().optional(),
  is_MFA_enabled: z.boolean(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(30)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "At least 1 uppercase,1 lowercase,1 number, 1 special character"
    ),
  createdAt: z.string().optional(), // coerce ISO string into Date
  updatedAt: z.string().optional(),
});

export const updateUserSchema = z.object({
  id: z
    .uuid()
    .refine(
      (val) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          val
        ),
      { message: "Invalid UUID v4 format" }
    )
    .optional(),
  username: z.string().min(1, "Username is required").optional(),
  email: z.email().optional(),
  role: z.enum(["user", "admin"]).optional(), // Adjust roles as needed
  avatar_url: z.string().nullable().optional(),
  avatar_id: z.uuid().nullable().optional(),
  is_MFA_enabled: z.boolean(),
  password: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        val === "" ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,30}$/.test(val),
      {
        message:
          "Password must be 8–30 chars, include 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      }
    ),
  createdAt: z.string().optional(), // coerce ISO string into Date
  updatedAt: z.string().optional(),
});

const userDataApiSchema = z.object({
  data: z.object({
    user: userSchema,
  }),
  message: z.string(),
});

const usersDataApiSchema = z.object({
  data: z.object({
    users: z.array(userSchema),
    currentPage: z.number(),
    totalPages: z.number(),
    totalItems: z.number(),
  }),
});
const recipientSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must not exceed 100 characters"),

  branch: z
    .enum([
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
    ] as const)
    .refine((val) => !!val, { message: "Branch is required" }),

  phone_number: z
    .string()
    .regex(
      /^2547\d{8}$/,
      "Phone number must start with 2547 and be 12 digits long"
    ),

  operator: z
    .enum(["Safaricom", "Airtel"] as const)
    .refine((val) => !!val, { message: "Operator is required" }),

  // operator_code: z
  //   .number()
  //   .int()
  //   .refine((val) => [265, 266].includes(val), {
  //     message: "Operator code must be one of 265 or 266",
  //   }),

  airtime_amount: z
    .transform(Number) //converts the type to a number
    .pipe(
      //revalidates it as a number
      z
        .number({ error: "Invalid input, not a number" })
        .min(5, "Minimum airtime topup is KES 5")
        .max(10000, "Maximum topup is KES 10,000")
    ), // ensures it's typed properly

  designation: z
    .string()
    .min(3, "Designation must be at least 3 characters long")
    .max(50, "Designation too long"),
  user_id: z.string(),
  department: z.enum(KUNITY_DEPARTMENTS, { error: "Department is required" }),
});

const paginateSchema = z.object({
  page: z.coerce.number({ error: "Page is not a number" }),
  limit: z.coerce.number({ error: "Limit is not a number" }),
});

const recipientQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  department: z.string().optional(),
  branch: z.string().optional(),
  name: z.string().optional(),
});

const refreshTokenSchema = z.object({
  data: z.object({
    access_token: z.string(),
    expires_in: z.number(),
    token_type: z.string(),
  }),
});

const IdSchema = z
  .uuid()
  .refine(
    (val) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        val
      ),
    { message: "ID must be  valid" }
  );

const recipientDataSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must not exceed 100 characters"),

  branch: z
    .enum([
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
    ] as const)
    .refine((val) => !!val, { message: "Branch is required" }),

  phone_number: z
    .string()
    .regex(
      /^2547\d{8}$/,
      "Phone number must start with 2547 and be 12 digits long"
    ),

  operator: z
    .enum(["Safaricom", "Airtel"] as const)
    .refine((val) => !!val, { message: "Operator is required" }),

  operator_code: z
    .number()
    .int()
    .refine((val) => [265, 266].includes(val), {
      message: "Operator code must be one of 265 or 266",
    }),

  airtime_amount: z
    .transform(Number) //converts the type to a number
    .pipe(
      //revalidates it as a number
      z
        .number({ error: "Invalid input, not a number" })
        .min(5, "Minimum airtime topup is KES 5")
        .max(10000, "Maximum topup is KES 10,000")
    ), // ensures it's typed properly

  designation: z
    .string()
    .min(3, "Designation must be at least 3 characters long")
    .max(50, "Designation too long"),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const recipientUpdateSchema = z.object({
  data: z.object({
    id: z.string(),
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(100, "Name must not exceed 100 characters"),

    branch: z
      .enum([
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
      ] as const)
      .refine((val) => !!val, { message: "Branch is required" }),

    phone_number: z
      .string()
      .regex(
        /^2547\d{8}$/,
        "Phone number must start with 2547 and be 12 digits long"
      ),

    operator: z
      .enum(["Safaricom", "Airtel"] as const)
      .refine((val) => !!val, { message: "Operator is required" }),

    operator_code: z
      .number()
      .int()
      .refine((val) => [265, 266].includes(val), {
        message: "Operator code must be one of 265 or 266",
      }),

    airtime_amount: z
      .transform(Number) //converts the type to a number
      .pipe(
        //revalidates it as a number
        z
          .number({ error: "Invalid input, not a number" })
          .min(5, "Minimum airtime topup is KES 5")
          .max(10000, "Maximum topup is KES 10,000")
      ), // ensures it's typed properly

    designation: z
      .string()
      .min(3, "Designation must be at least 3 characters long")
      .max(50, "Designation too long"),
    active: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});
const recipientDataApiSchema = z.object({
  data: z.object({
    currentPage: z.number(),
    recipients: z.array(recipientDataSchema),
    totaItems: z.number(),
    totalPages: z.number(),
  }),
});

const operatorDetailsSchema = z.object({
  phone_number: z.string().min(12).max(12),
  countryIsoCode: z.string().min(2).max(2).default("KE"),
});

const operatorDetailsSchemaApi = z.object({
  data: z.object({
    operatorId: z.number(),
    name: z.string(),
  }),
  message: z.string(),
});

export const phoneRegex = /^2547\d{8}$/;

export const singleTopUpSchema = z.object({
  phone_number: z
    .string("Phone is required")
    .min(12, "Phone number should be 12 characters long")
    .max(12, "Phone number should be 12 characters long")
    .regex(
      phoneRegex,
      "Phone number must start with 2547 and be 12 digits long"
    ),
  airtime_amount: z
    .transform(Number) //converts the type to a number
    .pipe(
      //revalidates it as a number
      z
        .number({ error: "Invalid input, not a number" })
        .min(5, "Minimum airtime topup is KES 5")
        .max(10000, "Maximum topup is KES 10,000")
    ), // ensures it's typed properly

  // operator_code: z.number(),
  // operator: z.enum(["Safaricom", "Airtel"], {
  //   message: "Operator is required",
  // }),
  // countryIsoCode: z.string().min(2).max(2),
});

const topUpDataSchema = z.object({
  id: z.string(),
  phone_number: z.string(),
  airtime_amount: z.string(),
  operatro: z.string(),
  status: z.enum(["Success", "Failed", "Pending"]),
  createdAt: z.date(),
  recipient: recipientSchema
});
const topUpDataApiSchema = z.object({
  data: z.object({
    currentPage: z.number(),
    topups: z.array(topUpDataSchema),
    totaItems: z.number(),
    totalPages: z.number(),
  }),
});

export const transactionDataSchema = z.object({
  id: z.string(),
  amount: z.string(),
  transaction_type: z.string(),
  status: z.enum(["Success", "Failed", "Pending"]),
  createdAt: z.date(),
  deletedAt: z.date(),
  account: z.object({
    account_number: z.number(),
    wallet_type: z.string()
  }),
});

export const ledgerDataSchema = z.object({
  id: z.string(),
  transaction_id: z.string(),
  createdAt: z.date(),
  deletedAt: z.date(),
  accountInfo: z.object({
    account_number: z.number(),
    wallet_type: z.string(),
  }),
  transInfo: z.object({
    transaction_type: z.string(),
  }),
  balance_before: z.number(),
  balance_after: z.number(),
});
const transactionDataApiSchema = z.object({
  data: z.object({
    currentPage: z.number(),
    transactions: z.array(transactionDataSchema),
    totaItems: z.number(),
    totalPages: z.number(),
  }),
});
const ledgerDataApiSchema = z.object({
  data: z.object({
    currentPage: z.number(),
    ledgers: z.array(ledgerDataSchema),
    totaItems: z.number(),
    totalPages: z.number(),
  }),
});

export const csvDataSchema = z.object({
  name: z.string("Name is required"),
  phone: z
    .string()
    .regex(
      /^2547\d{8}$/,
      "Phone number must start with 2547 and be 12 digits long"
    ),
  amount: z
    .transform(Number) //converts the type to a number
    .pipe(
      //revalidates it as a number
      z
        .number({ error: "Invalid input, not a number" })
        .min(5, "Minimum airtime topup is KES 5")
        .max(10000, "Maximum topup is KES 10,000")
    ), // ensures it's typed properly
  branch: z
    .enum(KUNITY_BRANCHES)
    .refine((val) => !!val, { message: "Branch is required" }),
  operator: z
    .enum(["Safaricom", "Airtel"] as const)
    .refine((val) => !!val, { message: "Operator is required" }),
});

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_FILE_TYPE = "text/csv"
export const bulkTopUpSchema = z.object({
  // operator: z.enum(["Safaricom", "Airtel", "Telkom"]),
  recipients: z.array(csvDataSchema),
  file: z.instanceof(File, {message: "No file choosen"})
  .optional()
  .refine((file) => {
    return !file || file.size <= MAX_FILE_SIZE
  }, "File must be less than 10MB")
  .refine((file) => {
    return !file || file.type === ACCEPTED_FILE_TYPE
  }, "File must be a csv file")
});

export const walletBalanceSchema = z.object({
  data: z.object({
    balance: z.string(),
    account_number: z.string(),
    wallet_type: z.enum(WALLET_TYPES),
    currency_code: z.string(),
    currency_name: z.string(),
    lower_threshold: z.string(),
    upper_threshold: z.string(),
  }),
});

export const walletFormSchema = z.object({
  lower_threshold: z.string().optional(), // ensures it's typed properly,
  upper_threshold: z.string().optional(), // ensures it's typed properly,
  wallet_type: z.enum(WALLET_TYPES),
  account_number: z.string(),
  userId: z.string(),
}); 

const analyticsSchema = z.object({
  data: z.object({
    totalRecipients: z.number(),
    totalTopUps: z.number(),
    walletBalance: z.number(),
    recipientGrowth: z.array(
      z.object({
        month: z.string(),
        count: z.number(),
      })
    ),
    topUpTrends: z.array(
      z.object({
        month: z.number(),
        totalAirtime: z.number(),
        totalTopups: z.number(),
      })
    ),
  }),
});
const analyticsAdminSchema = z.object({
  data: z.object({
    stats: z.object({
        totalUsers: z.number(),
        totalTransactions: z.number(),
        walletBalance: z.number(),
        totalTopUps: z.number(),
      }),
    transactionGrowth: z.array(
      z.object({
        month: z.string(),
        count: z.number(),
      })
    ),
    airtimePurchases: z.array(
      z.object({
        month: z.number(),
        totalAirtime: z.number(),
        totalTopups: z.number(),
      })
    ),
  }),
});


export type BulkTopUpForm = z.infer<typeof bulkTopUpSchema>;
export type SignUpAuth = z.infer<typeof signUpSchema>;
export type SignInAuth = z.infer<typeof signInSchema>;
export type RecipientForm = z.infer<typeof recipientSchema>;
export type UserForm = z.infer<typeof userSchema>;
export type UserUpdateForm = z.infer<typeof updateUserSchema>;
export { signUpSchema, signInSchema, recipientSchema };
export type PaginateData = z.infer<typeof paginateSchema>;
export type Id = z.infer<typeof IdSchema>;
export type OperatorDatail = z.infer<typeof operatorDetailsSchema>;
export type SingleTopUpForm = z.infer<typeof singleTopUpSchema>;
export type ParsedRecipient = z.infer<typeof csvDataSchema>;
export type RecipientQueryData = z.infer<typeof recipientQuerySchema>;
export type WalletForm = z.infer<typeof walletFormSchema>;
export type TransactionData = z.infer<typeof transactionDataSchema>;
export type LedgerData = z.infer<typeof ledgerDataSchema>;

//Api responses types
export type RecipientData = z.infer<typeof recipientDataSchema>;
export type RecipientDataApi = z.infer<typeof recipientDataApiSchema>;
export type Recipientupdate = z.infer<typeof recipientUpdateSchema>;
export type UserDataApi = z.infer<typeof userDataApiSchema>;
export type UserData = z.infer<typeof userSchema>;
export type TokenResponse = z.infer<typeof refreshTokenSchema>;
export type OperatorDetect = z.infer<typeof operatorDetailsSchemaApi>;
export type TopUpData = z.infer<typeof topUpDataSchema>;
export type TopUpDataApi = z.infer<typeof topUpDataApiSchema>
export type WalletData = z.infer<typeof walletBalanceSchema>
export type Analytics = z.infer<typeof analyticsSchema>
export type AnalyticsAdmin = z.infer<typeof analyticsAdminSchema>
export type UsersDataApi = z.infer<typeof usersDataApiSchema>
export type TransactionDataApi = z.infer<typeof transactionDataApiSchema>;
export type LedgerDataApi = z.infer<typeof ledgerDataApiSchema>;
