import { z } from "zod";

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

//validate access token
const tokenSchema = z.jwt({ alg: "HS256" });

//covert from zod types to typescript types
export type SignUpAuth = z.infer<typeof signUpSchema>;
export type SignInAuth = z.infer<typeof signInSchema>;
export type Token = z.infer<typeof tokenSchema>;

export { signUpSchema, signInSchema, tokenSchema };
