import { z } from "zod";
import { fileSchema } from "./file";

export const isEmpty = (value: string) => value.trim().length > 0;

export const createTeacherSchema = z.object({
  name: z
    .string()
    .refine((arg) => isEmpty(arg), "اسم (انگلیسی) استاد نمیتواند خالی باشد"),
  title: z
    .string()
    .refine((arg) => isEmpty(arg), "اسم (فارسی) استاد نمیتواند خالی باشد"),
  about: z
    .string()
    .refine((arg) => isEmpty(arg), "درباره استاد نمیتواند خالی باشد"),
  image: fileSchema,
});

export const editTeacherSchema = createTeacherSchema.omit({ image: true });
