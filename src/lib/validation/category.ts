import { z } from "zod";
import { isEmpty } from "./teacher";

export const createCategorySchema = z.object({
  title: z.string().refine((value) => isEmpty(value) , 'عنوان نمیتواند خالی باشد'),
  name: z.string().refine((value) => isEmpty(value) , 'اسم نمیتواند خالی باشد'),
});
