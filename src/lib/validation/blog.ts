import { z } from "zod";
import { isEmpty } from "./teacher";
import { fileSchema } from "./file";

export const createBlogSchema = z.object({
  title: z
    .string()
    .refine((value) => isEmpty(value), "عنوان وبلاگ نمیتواند خالی باشد"),
  description: z
    .string()
    .refine((value) => isEmpty(value), "توضیح وبلاگ نمیتواند خالی باشد"),
  author: z
    .string()
    .refine((value) => isEmpty(value), "نویسنده وبلاگ نمیتواند خالی باشد"),
  html: z
    .string()
    .refine((value) => isEmpty(value), "درباره وبلاگ نمیتواند خالی باشد"),
  cover: fileSchema,
});

export const editBlogSchema = createBlogSchema.omit({
  cover: true,
});
