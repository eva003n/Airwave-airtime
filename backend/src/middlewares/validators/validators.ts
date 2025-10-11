import { minLength, object, z } from "zod";
import { MobileOperator } from "../../models/Recipients.js";

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
  amount: z
    .number()
    .min(5, "Top up cannot be below 5")
    .max(10000, "Top up cannot exceed 10,000"),
  operatorId: z
    .number()
    .refine((val) => val == 265 || val == 266, {
      message: "Operators ID supported are either 265 or 266",
    })
    .default(266),
  recipientPhone: z.object({
    countryCode: z.string()
    .min(1, "Country code too short").max(5, "Country code too long").default("KE"),
    number: z.string().min(12, "Phone number too short").max(12, "Phone number too long"),
  }),
});

const IdSchema =  z.object({
  id: z.string()
})

const OperatorDetailsSchema = z.object({
  phoneNumber: z.string().min(12).max(12),
  countryIsoCode: z.string().min(2).max(2).default("KE")

})

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
    "Branch is required"
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
});

const multipleRecipientSchema = z.array(recipientSchema).min(1).max(100)

const paginateSchema = z.object({
  page: z.coerce.number({error: "Page is not a number"}),
  limit: z.coerce.number({error: "Limit is not a number"})
})


//covert from zod types to typescript types
export type SignUpAuth = z.infer<typeof signUpSchema>;
export type SignInAuth = z.infer<typeof signInSchema>;
export type Token = z.infer<typeof tokenSchema>;
export type TopUp = z.infer<typeof topUpSchema>
export type Id = z.infer<typeof IdSchema>
export type OperatorDatail = z.infer<typeof OperatorDetailsSchema >
export type RecipientData = z.infer<typeof recipientSchema>;
export type BulkRecipientData = z.infer<typeof multipleRecipientSchema>;
export type PaginateData = z.infer<typeof paginateSchema>

export { signUpSchema, signInSchema, tokenSchema, topUpSchema, IdSchema, OperatorDetailsSchema, recipientSchema, paginateSchema, multipleRecipientSchema };
