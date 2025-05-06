import { z } from "zod";
import { isEmpty } from "./teacher";
import { isValidObjectId } from "mongoose";

export const createCommentSchema = z.object({
  text: z.string().refine((value) => isEmpty(value), "نظر نمیتواند خالی باشد"),
  entityType: z.enum(["Blog", "Course"]),
  userId: z
    .string()
    .refine((value) => isValidObjectId(value), "invalid user id"),
  entityId: z
    .string()
    .refine((value) => isValidObjectId(value), "invalid entity id"),
  parentId: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
});
