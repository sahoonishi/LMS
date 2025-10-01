import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z.email({ message: "Invalid email!" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .nonempty({ message: "Please enter your password!" }),
});

export type LoginFormValidationType = z.infer<typeof LoginFormSchema>;

// SignUp schema
export const SignUpFormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters"),
    email: z.email({ message: "Invalid email!" }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(32, "Password must be less than 32 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormValidationType = z.infer<typeof SignUpFormSchema>;
