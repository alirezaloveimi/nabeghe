"use client";

import { useActionState, useState } from "react";
import Button from "../Button";
import { EditorState } from "./AddNewCouresForm";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";
import InputField from "../InputField";
import Textarea from "../Textarea";
import Editor from "../Editor";
import { editBlog } from "@/actions/blog";

export default function EditBlogForm({
  _id,
  author,
  description,
  title,
  html,
}: Blog) {
  const [editor, setEditor] = useState<EditorState>({
    html: html,
    htmlImages: [],
  });

  const [state, action, pending] = useActionState(
    toastCallback(
      async (state: unknown, formData: FormData) =>
        editBlog(state, formData, _id),
      {
        onSuccess(result) {
          toast.success(result.message);
        },
        onError(result) {
          toast.error(result.message);
        },
      }
    ),
    undefined
  );

  const editBlogActionHandler = (formData: FormData) => {
    formData.append("html", editor.html);

    editor.htmlImages.forEach((file) => {
      formData.append("htmlImages", file);
    });

    action(formData);
  };

  return (
    <form action={editBlogActionHandler} className="space-y-3">
      <div className="flex flex-col md:flex-row [&>*]:flex-1 gap-4">
        <InputField
          type="text"
          label="عنوان وبلاگ"
          name="title"
          error={state?.errors?.title}
          defaultValue={state?.inputs?.title || title}
        />

        <InputField
          type="text"
          label="نویسنده وبلاگ"
          name="author"
          error={state?.errors?.author}
          defaultValue={state?.inputs?.author || author}
        />
      </div>

      <div>
        <Textarea
          rows={6}
          label="توضیحات دوره"
          name="description"
          defaultValue={state?.inputs?.description || description}
          error={state?.errors?.description}
        />
      </div>

      <div>
        <Editor
          label="توضیحات وبلاگ"
          error={state?.errors?.html}
          value={editor.html}
          onUpdateHandler={(newValue: EditorState) => setEditor(newValue)}
        />
      </div>

      <Button pending={pending} type="submit">
        ویرایش وبلاگ
      </Button>
    </form>
  );
}
