"use client";
import { useActionState, useState } from "react";
import Image from "next/image";

import BulletLabel from "./BulletLabel";
import Button from "./Button";
import Alert from "./Alert";
import Textarea from "./Textarea";

import { CommetActionResolve } from "@/actions/comment";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";

type AddCommentProps = {
  entityType: CommentT["entityType"];
  user: User | undefined;
  id: string;
  action: (_: unknown, formData: FormData) => Promise<CommetActionResolve>;
};

export default function AddComment({
  entityType,
  user,
  id,
  action,
}: AddCommentProps) {
  const [sendComment, setSendComment] = useState(false);
  const [state, commentAction, pending] = useActionState(
    toastCallback(action, {
      onError(result) {
        toast.error(result.message);
      },
      onSuccess(result) {
        toast.success(result.message, {
          onClose() {
            setSendComment(false);
          },
        });
      },
    }),
    undefined
  );

  const isLogin = Boolean(user);
  const role = user ? user.role : "";

  return (
    <>
      <div className="flex-between-center">
        <BulletLabel label="دیدگاه و پرسش" />

        {isLogin && role === "USER" && (
          <Button onClick={() => setSendComment(true)} width={180}>
            اضافه کردن کامنت جدید
          </Button>
        )}
      </div>

      {!isLogin && (
        <Alert>برای ثبت کامنت باید در وبسایت ثبت نام یا وارد شوید</Alert>
      )}

      {isLogin && role === "USER" && sendComment && (
        <div className="bg-background border border-border rounded-3xl p-5 mb-5">
          <BulletLabel label="ارسال دیدگاه یا پرسش" />

          <div className="flex-align-center gap-x-3 my-5">
            <div className="flex items-center gap-3 sm:w-auto w-full">
              <Image
                width={40}
                height={40}
                src={user?.image?.url || "/images/user-no-image.png"}
                className="rounded-full"
                alt="user-profile"
              />
              <span className="font-bold text-sm text-foreground">
                {user?.fullname}
              </span>
            </div>

            <button
              onClick={() => setSendComment(false)}
              type="button"
              className="font-bold text-sm text-red-500 mr-auto"
            >
              لغو پاسخ
            </button>
          </div>

          <form action={commentAction}>
            <Textarea rows={10} name="text" error={state?.errors?.text} />
            <input type="hidden" name="userId" value={user?._id} />
            <input type="hidden" name="entityType" value={entityType} />
            <input type="hidden" name="entityId" value={id} />

            <div className="mt-5 flex justify-end">
              <Button type="submit" width={200} pending={pending}>
                ثبت کامنت
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
