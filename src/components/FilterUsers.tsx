"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import InputField from "./InputField";
import Button from "./Button";

import { CiSearch } from "react-icons/ci";

export default function FilterUsers() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("s")?.toString() ?? "");

  const searchClickHandler = () => {
    const params = new URLSearchParams(searchParams);

    if (search.trim().length) {
      params.set("s", search);
    } else {
      params.delete("s");
    }

    replace(`/p-admin/users?${params.toString()}`);
  };

  return (
    <div className="space-y-3">
      <InputField
        id="search"
        label="پیدا کردن کاربر"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button
        type="button"
        onClick={searchClickHandler}
        icon={<CiSearch className="text-xl" />}
      >
        بگرد
      </Button>
    </div>
  );
}
