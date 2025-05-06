import { z } from "zod";
import { isValidObjectId } from "mongoose";

import { isEmpty } from "./teacher";
import { fileSchema } from "./file";

export const createCourseSchema = z.object({
  title: z
    .string()
    .refine((value) => isEmpty(value), "عنوان دوره نمیتواند خالی باشد"),
  description: z
    .string()
    .refine((value) => isEmpty(value), "توضیح دوره نمیتواند خالی باشد"),
  html: z
    .string()
    .refine((value) => isEmpty(value), "درباره دوره نمیتواند خالی باشد"),
  price: z.coerce
    .number()
    .refine((value) => value >= 0, "قیمت دوره نمیتواند کمتر از 0 باشد"),
  discount: z.coerce
    .number()
    .min(0, "درصد تخفیف نمیتواند کمتر از 0 باشد")
    .max(100, "درصد تخفیف نمیتواند بیشتر از 100 باشد")
    .optional(),
  category: z.string().refine((value) => isValidObjectId(value), {
    message: "دسته بندی دوره انتخاب نکردین",
  }),
  teacher: z.string().refine((value) => isValidObjectId(value), {
    message: "یک استاد انتخاب کنید",
  }),
  cover: fileSchema,
});

export const editCourseSchema = createCourseSchema
  .omit({
    teacher: true,
    category: true,
    cover: true,
  })
  .extend({
    discount: z.coerce
      .number()
      .min(0, "درصد تخفیف نمیتواند کمتر از 0 باشد")
      .max(100, "درصد تخفیف نمیتواند بیشتر از 100 باشد")
      .default(0),
  });
