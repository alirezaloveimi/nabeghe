"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/config/db";
import User from "@/lib/models/User";

import { registerSchema as editInfoSchema } from "@/lib/validation/auth";
import { rechargeWalletSchema } from "@/lib/validation/user";

import { getChangedFields } from "@/util/form";

export async function editInfo(_: unknown, formData: FormData) {
  const inputs = {
    fullname: formData.get("fullname") as string,
    phone: formData.get("phone") as string,
  };

  const result = editInfoSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
      message: "لطفا خطاهای فرم رو رفع کنید",
      inputs,
    };
  }

  const { fullname, phone } = result.data;

  try {
    await connectDB();
    const user = await User.findOne({ phone });

    const changedFields = getChangedFields(user, result.data);

    if (Object.keys(changedFields).length === 0) {
      return { success: false, message: "تغییری انجام نشده", inputs };
    }

    await User.findOneAndUpdate({ phone }, { fullname });
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور" };
  }

  revalidatePath("/p-user/profile");
  revalidatePath("/p-admin/profile");
  return { success: true, message: "اطلاعات با موفقیت بروزرسانی شد" };
}

export async function rechargeWallet(_: unknown, formData: FormData) {
  const inputs = { price: formData.get("price") as string };
  const result = rechargeWalletSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      message: "لطفا خطاهای فرم رو رفع کنید",
      errors: result.error.flatten().fieldErrors,
      success: false,
      inputs,
    };
  }

  const { price, id } = result.data;

  try {
    await connectDB();
    const user = await User.findById(id);
    user.wallet = user.wallet + price;
    user.save();
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور" };
  }

  revalidatePath("/p-user/wallet");
  return { success: true, message: "مبلغ مورد نظر به کیف پول اضافه شد" };
}

export async function addToCart(userId: string, courseId: string) {
  try {
    await connectDB();
    const course = await User.findOne({ _id: userId, cart: courseId });

    if (course) {
      return { success: false, message: "دوره در سبد شما موجود است" };
    }

    await User.findOneAndUpdate({ _id: userId }, { $push: { cart: courseId } });
  } catch (e) {
    console.log(e);
    return { message: "خطای سمت سرور", success: false };
  }

  revalidatePath("/courses/[id]", "page");
  return { message: "دوره به سبد شما اضافه شد", success: true };
}

export async function removeFromCart(userId: string, courseId: string) {
  try {
    await connectDB();
    await User.findByIdAndUpdate(userId, { $pull: { cart: courseId } });
  } catch (e) {
    console.log(e);
    return { success: false, message: "خطای سرور" };
  }

  return { success: true, message: "دوره از سبد خرید شما حذف شد" };
}
