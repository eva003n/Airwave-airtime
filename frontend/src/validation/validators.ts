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

const userSchema = z.object({
      id: z
        .string()
        .uuid()
        .refine(
          (val) =>
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
              val
            ),
          { message: "Invalid UUID v4 format" }
        ),
      username: z.string().min(1, "Username is required"),
      role: z.enum(["user", "admin"]), // Adjust roles as needed
      avatar_url: z.string(),
      avatar_id: z.uuid().nullable(),
      is_MFA_enabled: z.boolean(),
      createdAt: z.coerce.date(), // coerce ISO string into Date
      updatedAt: z.coerce.date(),
    })

const userDataApiSchema = z.object({
  data: z.object({
    user: userSchema,
  }),
  message: z.string()
})
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
  user_id: z.string()
});

const paginateSchema = z.object({
  page: z.coerce.number({ error: "Page is not a number" }),
  limit: z.coerce.number({ error: "Limit is not a number" }),
});

const IdSchema = z
    .uuid()
    .refine(
      (val) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          val
        ),
      { message: "ID must be  valid" }
    )

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

export type SignUpAuth = z.infer<typeof signUpSchema>;
export type SignInAuth = z.infer<typeof signInSchema>;
export type RecipientForm = z.infer<typeof recipientSchema>;
export { signUpSchema, signInSchema, recipientSchema };
export type PaginateData = z.infer<typeof paginateSchema>;
export type Id = z.infer<typeof IdSchema>;

//Api responses types
export type RecipientData = z.infer<typeof recipientDataSchema>;
export type RecipientDataApi = z.infer<typeof recipientDataApiSchema>;
export type Recipientupdate = z.infer<typeof recipientUpdateSchema>;
export type UserDataApi = z.infer<typeof userDataApiSchema>
export type UserData = z.infer<typeof userSchema>
