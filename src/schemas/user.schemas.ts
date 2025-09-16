import * as z from "zod";

export const signInSchema = z.object({
  phone: z.string().min(11).max(13),
});

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  role: z.enum(["ADMIN", "PENGURUS", "WARGA"]).default("WARGA"),
  rtId: z.string().min(1, "RT is required"),
});

export type UserSchema = z.infer<typeof UserSchema>;
