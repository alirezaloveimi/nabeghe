"use server";
import { connectDB } from "@/lib/config/db";
import Blog from "@/lib/models/Blog";
import { createBlogSchema, editBlogSchema } from "@/lib/validation/blog";
import { getChangedFields, processHtmlImages, removeImages } from "@/util/form";
import { deleteImage, uploadImage } from "@/util/upload";
import { revalidatePath } from "next/cache";

type Upload = Awaited<ReturnType<typeof uploadImage>>;

export async function createBlog(_: unknown, formData: FormData) {
  const editorFileImages = formData.getAll("htmlImages") as File[];
  const inputs = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    author: formData.get("author") as string,
  };

  const result = createBlogSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      inputs,
      errors: result.error.flatten().fieldErrors,
      message: "لطفا خطاهای فرم رو رفع کنید",
    };
  }

  const { author, cover, description, html, title } = result.data;

  try {
    await connectDB();

    const editorImagesSrc: Upload[] = [];
    for (const file of editorFileImages) {
      editorImagesSrc.push(await uploadImage(file, "blog"));
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

    const blogCover = await uploadImage(cover, "blog");

    if (blogCover.message) {
      return {
        success: false,
        message: "مشکلی در آپلود کاور وبلاگ",
        inputs,
      };
    }

    await Blog.create({
      title,
      description,
      author,
      cover: blogCover,
      html: updatedHtml,
    });
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور", inputs };
  }

  revalidatePath("/p-admin/blogs");
  return { message: "وبلاگ با موفقیت ساخته شد", success: true };
}

export async function editBlog(_: unknown, formData: FormData, id: string) {
  const editorFileImages = formData.getAll("htmlImages") as File[];

  const inputs = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    author: formData.get("author") as string,
  };

  const result = editBlogSchema.safeParse(Object.fromEntries(formData));

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
    const blog = await Blog.findById(id);
    if (!blog) {
      return { message: "وبلاگ مورد نظر یافت نشد", success: false, inputs };
    }

    const changedFields = getChangedFields(blog, result.data);

    if (Object.keys(changedFields).length === 0) {
      return { message: "تغییری ایجاد نشد است", success: false, inputs };
    }

    if (changedFields.html) {
      const { cleanupPaths, updatedHtml } = await processHtmlImages(
        blog.html,
        changedFields.html,
        editorFileImages,
        "blog"
      );

      for (const path of cleanupPaths) {
        await deleteImage(path);
      }

      changedFields.html = updatedHtml;
    }

    await Blog.findByIdAndUpdate(id, {
      ...changedFields,
    });
  } catch (e) {
    console.log(e);
    return { success: false, message: "مشکل سمت سرور", inputs };
  }

  revalidatePath("p-admin/blog/[id]", "page");
  return { success: true, message: "وبلاگ با موفقیت آپدیت شد" };
}

export async function toggleLike(userId: string | undefined, blogId: string) {
  if (!userId) {
    return { message: "لطفا اول در وبسایت ثبت نام کنید", success: false };
  }

  try {
    await connectDB();
    const isUserLikes = await Blog.findOne({ _id: blogId, likes: userId });

    if (isUserLikes) {
      await Blog.findByIdAndUpdate(blogId, { $pull: { likes: userId } });
      revalidatePath("/blogs/[id]", "page");
      return { message: "لایک حذف شد", success: true };
    }

    await Blog.findOneAndUpdate({ _id: blogId }, { $push: { likes: userId } });
    revalidatePath("/blogs/[id]", "page");
    return { message: "لایک شد", success: true };
  } catch (e) {
    console.log(e);
    return { message: "مشکلی سمت سرور", success: false };
  }
}

export async function deleteBlog(blogId: string) {
  try {
    await connectDB();
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return { message: "وبلاگ مورد نظر یافت نشد", success: false };
    }

    await removeImages(blog.html, blog.cover);
    await Blog.findByIdAndDelete(blogId);

    return { message: "وبلاگ مورد نظر حذف شد", success: true };
  } catch (e) {
    console.log(e);
    return { message: "مشکلی سمت سرور", success: false };
  }
}
