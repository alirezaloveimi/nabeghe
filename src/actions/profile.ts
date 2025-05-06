"use server";

import { connectDB } from "@/lib/config/db";
import { fileSchema } from "@/lib/validation/file";

import Teacher from "@/lib/models/Teacher";
import User from "@/lib/models/User";
import { deleteImage, uploadImage } from "@/util/upload";
import { revalidatePath } from "next/cache";

type Profile = {
  userId: string;
  profile: File;
  model: "USER" | "TEACHER";
};

export async function uploadProfile({ profile, model, userId }: Profile) {
  const result = fileSchema.safeParse(profile);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().formErrors,
      message: "لطفا خطاهای فرم رو رفع کنید",
    };
  }

  const imageFile = result.data;

  try {
    await connectDB();
    const selectedModel = model === "USER" ? User : Teacher;
    const imageUrl = await uploadImage(imageFile, "avatar");

    if (imageUrl.message) {
      return { success: false, message: imageUrl.message };
    }

    const user = await selectedModel.findById(userId);
    const oldImagePath: undefined | string = user?.image ? user.image.path : "";

    await selectedModel.findOneAndUpdate({ _id: userId }, { image: imageUrl });

    if (oldImagePath) {
      const { success, error } = await deleteImage(oldImagePath);

      if (!success && error) {
        return { success: false, message: error };
      }
    }
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور" };
  }

  switch (model) {
    case "TEACHER": {
      revalidatePath("/p-admin/teachers/[id]", "page");
      break;
    }
    case "USER": {
      revalidatePath("/p-user/profile");
      revalidatePath("/p-admin/profile");
      break;
    }
  }

  return {
    success: true,
    message: "پروفایل با موفقیت آپدیت شد",
  };
}
