import { minLength, z } from "zod";
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
const IdSchema = z.object({
    transactionId: z.string()
});
const OperatorDetailsSchema = z.object({
    phoneNumber: z.string().min(12).max(12),
    countryIsoCode: z.string().min(2).max(2).default("KE")
});
//validate access token
const tokenSchema = z.jwt({ alg: "HS256" });
export { signUpSchema, signInSchema, tokenSchema, topUpSchema, IdSchema, OperatorDetailsSchema };
