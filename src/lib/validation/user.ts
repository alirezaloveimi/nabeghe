import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const rechargeWalletSchema = z.object({
  price: z.coerce
    .number()
    .min(100_000, "حداقل مبلغ قابل شارژ 100 هزار تومان میباشد"),
  id: z
    .string()
    .refine((value) => isValidObjectId(value), "Invalid Object Id For User"),
});
