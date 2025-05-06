import { z } from "zod";

const limitSize = 1 * 1024 * 1024;
const allowedFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= limitSize,
    "حداکثر سایز عکس باید کمتر یا مساوی 1MB  باشد"
  )
  .refine(
    (file) => allowedFormats.includes(file.type),
    "فرمت انتخابی مجاز نیست"
  );
