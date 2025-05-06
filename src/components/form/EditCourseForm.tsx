"use client";
import { useActionState, useState } from "react";
// import { toastCallback } from "@/util/toast";

import Button from "../Button";
import InputField from "../InputField";
import Switch from "../Switch";
import { editCourse } from "@/actions/course";
import Editor from "../Editor";
import { EditorState } from "./AddNewCouresForm";
import Textarea from "../Textarea";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";

export default function EditCourseForm({
  description,
  discount,
  price,
  title,
  _id,
  html,
}: Course) {
  const [hasDiscount, setHasDiscount] = useState(Boolean(discount));
  const [editor, setEditor] = useState<EditorState>({
    html: html,
    htmlImages: [],
  });

  const [state, action, pending] = useActionState(
    toastCallback(
      async (state: unknown, formData: FormData) =>
        editCourse(state, formData, _id),
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

  const editCouresActionHandler = (formData: FormData) => {
    formData.append("html", editor.html);

    editor.htmlImages.forEach((file) => {
      formData.append("htmlImages", file);
    });

    action(formData);
  };

  return (
    <form action={editCouresActionHandler} className="space-y-3">
      <div className="flex flex-col md:flex-row [&>*]:flex-1 gap-4">
        <InputField
          type="text"
          label="عنوان دوره"
          name="title"
          error={state?.errors?.title}
          defaultValue={state?.inputs?.title || title}
        />
        <InputField
          type="number"
          label="قیمت دوره"
          name="price"
          error={state?.errors?.price}
          defaultValue={state?.inputs?.price || price}
        />

        <div className="flex flex-col gap-2.5">
          <Switch
            key={`switch-${hasDiscount ? "on" : "off"}`}
            label="تخفیف"
            isChecked={hasDiscount}
            onChange={() => setHasDiscount((h) => !h)}
          />
          <InputField
            name="discount"
            type="number"
            disabled={!hasDiscount}
            error={state?.errors?.discount}
            defaultValue={state?.inputs?.discount || discount}
          />
        </div>
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
          label="توضیحات دوره"
          error={state?.errors?.html}
          value={editor.html}
          onUpdateHandler={(newValue: EditorState) => setEditor(newValue)}
        />
      </div>

      <Button pending={pending} type="submit">
        ویرایش دوره
      </Button>
    </form>
  );
}
