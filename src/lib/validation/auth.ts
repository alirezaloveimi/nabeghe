import { z } from "zod";

const iranPhoneRegex = /^09\d{9}$/;

const phoneSchema = z
  .string()
  .regex(iranPhoneRegex, "شماره موبایل نامعتبر است");

const fullnameSchema = z
  .string()
  .trim()
  .min(3, "حداقل تعداد کاراکتر برای نام و نام خانوادگی، 3 عدد است");

export const loginSchema = z.object({ phone: phoneSchema });
export const registerSchema = z.object({
  phone: phoneSchema,
  fullname: fullnameSchema,
});

type UserInfo = z.infer<typeof registerSchema>;

export const verifyCodeSchema = z.object({
  code: z.string().length(5, "کد باید 5 رقمی باشد"),
  info: z.string().transform((value): UserInfo | string => {
    try {
      const parsed = JSON.parse(value);
      return parsed;
    } catch {
      return value;
    }
  }),
});
