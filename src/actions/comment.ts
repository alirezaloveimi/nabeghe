"use server";
import { connectDB } from "@/lib/config/db";
import Comment from "@/lib/models/Comment";
import { createCommentSchema } from "@/lib/validation/comment";

export async function createComment(_: unknown, formData: FormData) {
  const formValues = Object.fromEntries(formData);
  const inputs = { text: formData.get("text") as string };
  const result = createCommentSchema.safeParse(formValues);

  if (!result.success) {
    console.log(result.error.flatten().fieldErrors);

    return {
      success: false,
      message: "لطفا خطاهای فرم رو رفع کنید",
      errors: {
        text: result.error.flatten().fieldErrors.text,
      },
      inputs,
    };
  }

  const { entityId, entityType, text, userId, parentId } = result.data;

  try {
    await connectDB();

    if (parentId) {
      const existingReply = await Comment.findOne({
        parentId,
        entityType,
        isAnswer: true,
      });

      if (existingReply) {
        if (existingReply.text === text) {
          return {
            success: false,
            message: "همونه که یه چیز دیگه بنویسید",
          };
        }

        existingReply.text = text;
        await existingReply.save();

        return { success: true, message: "پاسخ شما بروزرسانی شد" };
      }

      await Comment.create({
        text,
        user: userId,
        entityId,
        entityType,
        parentId,
        isAnswer: true,
        isAccept: true,
      });

      return { success: true, message: "پاسخ شما با موفقیت ثبت شد" };
    }

    await Comment.create({
      text,
      user: userId,
      entityId,
      entityType,
      isAnswer: false,
      isAccept: false,
    });

    return { success: true, message: "کامنت شما با موفقیت ثبت شد" };
  } catch (e) {
    console.log(e);
    return { message: "مشکل سمت سرور", success: false, inputs };
  }
}
export const toggleCommentAccept = async (id: string, accept: boolean) => {
  try {
    await connectDB();
    await Comment.findOneAndUpdate({ _id: id }, { isAccept: !accept });
  } catch (e) {
    console.log(e);
    return { message: "خطای ناشناخته سمت سرور", success: false };
  }

  return { message: "وضعیت کامنت تغییر کرد", success: true };
};

export type CommetActionResolve = Awaited<ReturnType<typeof createComment>>;
