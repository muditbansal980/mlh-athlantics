import { z } from "zod";

export const LoginSchema = z.object({
    Email: z.email("Invalid email address"),
    Password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const RegisterSchema = z.object({
    Email: z.email("Invalid email address"),
    Password: z.string().min(6, "Password must be at least 6 characters long"),
    Username: z.string().min(2, "Username must be at least 2 characters long").max(100, "Username must be at most 100 characters long"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
