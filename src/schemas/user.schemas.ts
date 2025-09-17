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
  role: z.enum(["ADMIN", "PENGURUS", "WARGA"]).default("WARGA"),
  rtId: z
    .string({
      error: "RT Diperlukan",
    })
    .min(1, "RT Diperlukan"),
});

export type CreateUserInput = z.infer<typeof userSchema>;
