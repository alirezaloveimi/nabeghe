"use client";
import { useActionState } from "react";
import { editTeacher } from "@/actions/teacher";

import Button from "../Button";
import InputField from "../InputField";
import Textarea from "../Textarea";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";

export default function EditTeacherForm({ _id, about, name, title }: Teacher) {
  const [state, action, pending] = useActionState(
    toastCallback(
      async (state: unknown, formData: FormData) =>
        editTeacher(state, formData, _id),
      {
        onError(result) {
          toast.error(result.message);
        },
        onSuccess(result) {
          toast.success(result.message);
        },
      }
    ),
    undefined
  );

  return (
    <form className="space-y-4" action={action}>
      <div className="flex flex-col md:flex-row [&>div]:flex-1 gap-3">
        <InputField
          id="title"
          label="اسم (فارسی)"
          type="text"
          name="title"
          error={state?.errors?.title}
          defaultValue={state?.inputs?.title || title}
        />
        <InputField
          id="name"
          label="اسم (انگلیسی)"
          type="text"
          name="name"
          error={state?.errors?.name}
          defaultValue={state?.inputs?.name || name}
        />
      </div>

      <div className="flex flex-col items-stretch md:flex-row [&>*]:flex-1 gap-4">
        <Textarea
          id="about"
          rows={6}
          label="درباره استاد"
          name="about"
          error={state?.errors?.about}
          defaultValue={state?.inputs?.about || about}
        />
      </div>

      <Button type="submit" pending={pending}>
        ثبت استاد جدید
      </Button>
    </form>
  );
}
