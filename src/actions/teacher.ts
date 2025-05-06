"use server";
import { connectDB } from "@/lib/config/db";
import Teacher from "@/lib/models/Teacher";
import {
  createTeacherSchema,
  editTeacherSchema,
} from "@/lib/validation/teacher";
import { getChangedFields } from "@/util/form";
import { uploadImage } from "@/util/upload";
import { revalidatePath } from "next/cache";

export async function addNewTeacher(_: unknown, formData: FormData) {
  const inputs = {
    name: formData.get("name") as string,
    title: formData.get("title") as string,
    about: formData.get("about") as string,
  };

  const result = createTeacherSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
      message: "لطفا خطاهای فرم رو رفع کنید",
      inputs,
    };
  }

  const { name, about, title, image } = result.data;

  try {
    await connectDB();
    const upload = await uploadImage(image, "avatar");

    if (upload.message) {
      return { success: false, message: upload.message };
    }

    await Teacher.create({
      name,
      about,
      title,
      image: { path: upload.path, url: upload.url },
    });
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور" };
  }

  revalidatePath("/p-admin/teachers");
  return { success: true, message: "استاد جدید با موفقیت ایجاد شد" };
}

export async function editTeacher(
  _: unknown,
  formData: FormData,
  teacherId: string
) {
  const inputs = {
    name: formData.get("name") as string,
    title: formData.get("title") as string,
    about: formData.get("about") as string,
  };

  const result = editTeacherSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
      message: "لطفا خطاهای فرم رو رفع کنید",
      inputs,
    };
  }

  const teacherNewValue = result.data;

  try {
    await connectDB();
    const teacher = await Teacher.findOne({ _id: teacherId });

    const changedFields = getChangedFields(teacher, teacherNewValue);

    if (Object.keys(changedFields).length === 0) {
      return { success: false, message: "تغییری انجام نشده", inputs };
    }

    await Teacher.findByIdAndUpdate(teacher, changedFields);
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور" };
  }

  revalidatePath("/p-admin/teachers/[id]", "page");
  return { success: true, message: "اطلاعات با موفقیت بروزرسانی شد" };
}
