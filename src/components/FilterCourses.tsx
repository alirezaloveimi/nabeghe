"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { typeValues } from "@/data";
import Select from "./Select";

export default function FilterCourses() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const { replace } = useRouter();

  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    getAllCategory();
  }, []);

  const changeHandler = (value: string, query: string) => {
    const params = new URLSearchParams(searchParams);

    if (value !== "-1") {
      params.set(query, value);
    } else {
      params.delete(query);
    }

    replace(`/courses?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col md:max-w-xl md:flex-row md:items-center gap-5 [&>div]:flex-1">
      <Select
        data={typeValues}
        label="نوع دوره"
        defaultValue={searchParams.get("type")?.toString() || "-1"}
        onChange={(e) => changeHandler(e.target.value, "type")}
        renderItem={(item) => (
          <option key={`type-${item.id}`} value={item.value}>
            {item.title}
          </option>
        )}
      />
      <Select
        pendign={loading}
        data={categories}
        label="دسته بندی دوره"
        value={searchParams.get("category")?.toString() || "-1"}
        onChange={(e) => changeHandler(e.target.value, "category")}
        renderItem={(item) => (
          <option key={`category-${item._id}`} value={item.name}>
            {item.title}
          </option>
        )}
      />
    </div>
  );
}
