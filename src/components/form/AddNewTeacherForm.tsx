"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import { addNewTeacher } from "@/actions/teacher";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";

import Button from "../Button";
import FileUploader from "../FileUploader";
import InputField from "../InputField";
import Textarea from "../Textarea";

export default function AddNewTeacherForm() {
  const { push } = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const [state, action, pending] = useActionState(
    toastCallback(addNewTeacher, {
      onError(result) {
        toast.error(result.message);
      },
      onSuccess(result) {
        toast.success(result.message, {
          onClose: () => {
            setFile(null);
            push("/p-admin/teachers");
          },
        });
      },
    }),
    undefined
  );

  const handleFormSubmit = async (formData: FormData) => {
    action(formData);
    setFile(null);
  };

  return (
    <form className="space-y-4" action={handleFormSubmit}>
      <div className="flex flex-col md:flex-row [&>div]:flex-1 gap-3">
        <InputField
          id="title"
          label="اسم (فارسی)"
          type="text"
          name="title"
          error={state?.errors?.title}
          defaultValue={state?.inputs?.title}
        />
        <InputField
          id="name"
          label="اسم (انگلیسی)"
          type="text"
          name="name"
          error={state?.errors?.name}
          defaultValue={state?.inputs?.name}
        />
      </div>

      <div className="flex flex-col items-stretch md:flex-row [&>*]:flex-1 gap-4">
        <Textarea
          id="about"
          rows={6}
          label="درباره استاد"
          name="about"
          error={state?.errors?.about}
          defaultValue={state?.inputs?.about}
        />

        <FileUploader
          label="عکس استاد"
          name="image"
          height={144}
          error={state?.errors?.image}
          onChange={(file: File) => setFile(file)}
          file={file}
        />
      </div>

      <Button type="submit" pending={pending}>
        ثبت استاد جدید
      </Button>
    </form>
  );
}
