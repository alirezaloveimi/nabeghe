"use client";

import { useActionState, useState } from "react";
import FileUploader from "../FileUploader";
import InputField from "../InputField";
import Textarea from "../Textarea";
import Editor from "../Editor";
import { EditorState } from "./AddNewCouresForm";
import Button from "../Button";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createBlog } from "@/actions/blog";

export default function AddNewBlogForm() {
  const { push } = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [editor, setEditor] = useState<EditorState>({
    html: "",
    htmlImages: [],
  });

  const [state, action, pending] = useActionState(
    toastCallback(createBlog, {
      onError(result) {
        toast.error(result.message);
      },
      onSuccess(result) {
        setFile(null);
        setEditor({ html: "", htmlImages: [] });

        toast.success(result.message, {
          onClose: () => push("/p-admin/blogs"),
        });
      },
    }),
    undefined
  );

  const addBlogActionHandler = (formData: FormData) => {
    formData.append("html", editor.html);

    editor.htmlImages.forEach((file) => {
      formData.append("htmlImages", file);
    });

    action(formData);
    setFile(null);
  };

  return (
    <form action={addBlogActionHandler} className="space-y-3">
      <div className="flex flex-col md:flex-row [&>*]:flex-1 gap-4">
        <InputField
          type="text"
          label="عنوان وبلاگ"
          name="title"
          error={state?.errors?.title}
          defaultValue={state?.inputs?.title}
        />

        <InputField
          type="text"
          label="نویسنده وبلاگ"
          name="author"
          error={state?.errors?.author}
          defaultValue={state?.inputs?.author}
        />
      </div>

      <div className="flex flex-col md:flex-row [&>*]:flex-1 gap-4">
        <Textarea
          rows={6}
          label="توضیحات دوره"
          name="description"
          error={state?.errors?.description}
          defaultValue={state?.inputs?.description}
        />

        <FileUploader
          label="کاور وبلاگ"
          name="cover"
          height={144}
          onChange={(file: File) => setFile(file)}
          file={file}
          error={state?.errors?.cover}
        />
      </div>

      <div>
        <Editor
          value={editor.html}
          onUpdateHandler={(newValue: EditorState) => setEditor(newValue)}
          error={state?.errors?.html}
          label="توضیحات وبلاگ"
        />
      </div>

      <Button pending={pending} type="submit">
        ثبت دوره جدید
      </Button>
    </form>
  );
}
