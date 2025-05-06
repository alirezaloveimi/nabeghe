"use client";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createCoures } from "@/actions/course";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";

import FileUploader from "../FileUploader";
import InputField from "../InputField";
import Switch from "../Switch";
import Textarea from "../Textarea";
import Button from "../Button";
import Select from "../Select";
import Editor from "../Editor";

type DataState = {
  teachers: Teacher[];
  categories: Category[];
};

export type EditorState = {
  html: string;
  htmlImages: File[];
};

export default function AddNewCouresForm() {
  const { push } = useRouter();

  const [data, setData] = useState<DataState>({ categories: [], teachers: [] });
  const [editor, setEditor] = useState<EditorState>({
    html: "",
    htmlImages: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasDiscount, setHasDiscount] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [state, action, pending] = useActionState(
    toastCallback(createCoures, {
      onError(result) {
        toast.error(result.message);
      },
      onSuccess(result) {
        setFile(null);
        setEditor({ html: "", htmlImages: [] });

        toast.success(result.message, {
          onClose: () => push("/p-admin/courses"),
        });
      },
    }),
    undefined
  );

  useEffect(() => {
    const fetchDatas = async () => {
      const categoryUrl = "/api/category";
      const teacherUrl = "/api/teacher";

      try {
        const [categoryRes, teacherRes] = await Promise.all([
          fetch(categoryUrl),
          fetch(teacherUrl),
        ]);
        const categoryData = await categoryRes.json();
        const teacherData = await teacherRes.json();
        setData({ categories: categoryData, teachers: teacherData });
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatas();
  }, []);

  const addCouresActionHandler = (formData: FormData) => {
    formData.append("html", editor.html);

    editor.htmlImages.forEach((file) => {
      formData.append("htmlImages", file);
    });

    action(formData);
    setFile(null);
  };

  return (
    <form className="space-y-3" action={addCouresActionHandler}>
      <div className="flex flex-col md:flex-row [&>*]:flex-1 gap-4">
        <InputField
          type="text"
          label="عنوان دوره"
          name="title"
          error={state?.errors?.title}
          defaultValue={state?.inputs?.title}
        />
        <InputField
          type="number"
          label="قیمت دوره"
          name="price"
          error={state?.errors?.price}
          defaultValue={state?.inputs?.price || 0}
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
            defaultValue={state?.inputs?.discount || 0}
          />
        </div>
      </div>

      <div className="flex flex-col items-stretch md:flex-row [&>*]:flex-1 gap-4">
        <Select
          label="استاد دوره"
          name="teacher"
          data={data.teachers}
          error={state?.errors?.teacher}
          key={`select-teacher-${state?.inputs?.teacher ?? "-1"}`}
          defaultValue={state?.inputs?.teacher ?? "-1"}
          pendign={isLoading}
          renderItem={(item) => (
            <option key={item._id} value={item._id}>
              {item.title}
            </option>
          )}
        />

        <Select
          pendign={isLoading}
          label="دسته بندی دوره"
          name="category"
          data={data.categories}
          error={state?.errors?.category}
          key={`select-category-${state?.inputs?.category ?? "-1"}`}
          defaultValue={state?.inputs?.category ?? "-1"}
          renderItem={(item) => (
            <option key={item._id} value={item._id}>
              {item.title}
            </option>
          )}
        />
      </div>

      <div className="flex flex-col items-stretch md:flex-row [&>*]:flex-1 gap-4">
        <Textarea
          rows={6}
          label="توضیحات دوره"
          name="description"
          error={state?.errors?.description}
          defaultValue={state?.inputs?.description}
        />
        <FileUploader
          label="کاور دوره"
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
          label="توضیحات دوره"
        />
      </div>

      <Button pending={pending} type="submit">
        ثبت دوره جدید
      </Button>
    </form>
  );
}
