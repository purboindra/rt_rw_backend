import * as z from "zod";

export const signInSchema = z.object({
  phone: z.string().min(11).max(13),
});

export const userSchema = z.object({
  name: z
    .string({
      error: "Nama diperlukan",
    })
    .min(1, "Nama diperlukan"),
  phone: z
    .string({
      error: "Nomor handphone/whatsapp diperlukan",
    })
    .min(1, "Nomor handphone/whatsapp diperlukan"),
  email: z.string().optional(),
  address: z
    .string({
      error: "Alamat tempat tinggal diperlukan",
    })
    .min(1, "Alamat tempat tinggal diperlukan"),
  role: z.enum(["ADMIN", "BENDAHARA", "WARGA"]).default("WARGA"),
  rtId: z
    .string({
      error: "RT Diperlukan",
    })
    .min(1, "RT Diperlukan"),
});

export type CreateUserInput = z.infer<typeof userSchema>;

export const updateUserSchema = z.object({
  name: z
    .string({
      error: "Nama diperlukan",
    })
    .min(1, "Nama diperlukan")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?\d{8,15}$/)
    .optional(),
  email: z.string().optional(),
  address: z
    .string({
      error: "Alamat tempat tinggal diperlukan",
    })
    .min(1, "Alamat tempat tinggal diperlukan")
    .optional(),
  isVerified: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  phoneNumberVerified: z.boolean().optional(),
  role: z.enum(["ADMIN", "BENDAHARA", "WARGA"]).optional(),
  image: z.url().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const requestEmailVerificationSchema = z.object({
  email: z.email(),
});

export const verifyEmailSchema = z.object({
  email: z.email(),
  code: z.string().length(6, "Kode OTP harus 6 digit"),
});

export const getUserQuery = z.object({
  q: z.string().optional(),
  rtId: z.string().uuid().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  cursor: z.string().optional(),
  order: z.enum(["desc", "asc"]).default("desc"),
});
