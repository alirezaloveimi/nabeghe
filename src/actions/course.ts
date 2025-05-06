"use server";
import { connectDB } from "@/lib/config/db";
import Course from "@/lib/models/Course";
import Teacher from "@/lib/models/Teacher";
import User from "@/lib/models/User";

import { createCourseSchema, editCourseSchema } from "@/lib/validation/course";
import { getChangedFields, processHtmlImages } from "@/util/form";
import { deleteImage, uploadImage } from "@/util/upload";
import { revalidatePath } from "next/cache";

type Upload = Awaited<ReturnType<typeof uploadImage>>;

export async function createCoures(_: unknown, formData: FormData) {
  const editorFileImages = formData.getAll("htmlImages") as File[];
  const inputs = {
    title: formData.get("title") as string,
    price: formData.get("price") as string,
    description: formData.get("description") as string,
    discount: formData.get("discount") as string,
    category: formData.get("category") as string,
    teacher: formData.get("teacher") as string,
  };

  const result = createCourseSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      message: "لطفا خطاهای فرم رو رفع کنید",
      errors: result.error.flatten().fieldErrors,
      inputs,
    };
  }

  const {
    category,
    cover,
    description,
    discount,
    price,
    teacher,
    title,
    html,
  } = result.data;

  try {
    await connectDB();

    const editorImagesSrc: Upload[] = [];
    for (const file of editorFileImages) {
      editorImagesSrc.push(await uploadImage(file, "course"));
    }

    const isHaveErrorOnUpload = editorImagesSrc.some(
      (upload) => upload.message
    );

    if (isHaveErrorOnUpload) {
      return {
        success: false,
        message: "مشکلی در آپلود عکس های ادیتور",
        inputs,
      };
    }

    let index = 0;
    const updatedHtml = html.replace(/src="([^"]*)"/g, () => {
      return `src="${editorImagesSrc[index++].url}"`;
    });

    const couresCover = await uploadImage(cover, "course");

    if (couresCover.message) {
      return {
        success: false,
        message: "مشکلی در آپلود کاور دوره",
        inputs,
      };
    }

    const newCourse = await Course.create({
      price,
      discount,
      title,
      description,
      category,
      teacher,
      cover: couresCover,
      html: updatedHtml,
    });

    await Teacher.findByIdAndUpdate(
      { _id: teacher },
      { $push: { courses: newCourse._id } }
    );
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور", inputs };
  }

  revalidatePath("/p-admin/courses");
  return { message: "دوره با موفقیت ساخته شد", success: true };
}

export async function editCourse(_: unknown, formData: FormData, id: string) {
  const editorFileImages = formData.getAll("htmlImages") as File[];

  const inputs = {
    title: formData.get("title") as string,
    price: formData.get("price") as string,
    description: formData.get("description") as string,
    discount: (formData.get("discount") as string) || "0",
    category: formData.get("category") as string,
    teacher: formData.get("teacher") as string,
  };

  const result = editCourseSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      message: "لطفا خطاهای فرم رو رفع کنید",
      errors: result.error.flatten().fieldErrors,
      inputs,
    };
  }

  try {
    await connectDB();

    const course = await Course.findById(id);
    if (!course)
      return { message: "دوره مورد نظر یافت نشد", success: false, inputs };

    const changedFields = getChangedFields(course, result.data);

    if (Object.keys(changedFields).length === 0) {
      return { message: "تغییری ایجاد نشد است", success: false, inputs };
    }

    if (changedFields.html) {
      const { cleanupPaths, updatedHtml } = await processHtmlImages(
        course.html,
        changedFields.html,
        editorFileImages,
        "course"
      );

      for (const path of cleanupPaths) {
        await deleteImage(path);
      }

      changedFields.html = updatedHtml;
    }

    await Course.findByIdAndUpdate(id, {
      ...changedFields,
    });
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور", inputs };
  }

  revalidatePath("p-admin/courses/[id]", "page");
  return { success: true, message: "دوره با موفقیت آپدیت شد" };
}

export const registerToCourse = async (userId: string, cartPrice: number) => {
  try {
    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return { message: "کابر یافت نشد", success: false };
    }

    const canBuy = user.wallet - cartPrice >= 0;

    if (canBuy) {
      const coursesId = user.cart || [];

      for (const courseId of coursesId) {
        await Course.findOneAndUpdate(courseId, {
          $push: { students: userId },
        });
      }

      user.wallet = user.wallet - cartPrice;
      user.cart = [];
      user.save();
    } else {
      return { message: "موجودی کیف پول شما کافی نمیباشد", success: false };
    }
  } catch (e) {
    console.log(e);
    return { message: "خطای سرور", success: false };
  }

  return { success: true, message: "خرید شما با موفقیت انجام شد" };
};
