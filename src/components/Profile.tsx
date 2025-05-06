"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";

import { HiPencil } from "react-icons/hi2";
import { FiUpload } from "react-icons/fi";

import Button from "./Button";
import { uploadProfile } from "@/actions/profile";
import { toast } from "react-toastify";

type ProfileProps = {
  defaultImg: ImageT | string;
  userId: string;
  model: "USER" | "TEACHER";
};

export default function Profile({ model, userId, defaultImg }: ProfileProps) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = file
    ? URL.createObjectURL(file)
    : typeof defaultImg === "string"
    ? defaultImg
    : defaultImg.url;

  const clickHandler = () => {
    inputRef.current?.click();
  };

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    const result = await uploadProfile({
      model,
      userId,
      profile: file as File,
    });

    if (result?.success) {
      toast.success(result.message);
      return;
    }

    toast.error(result?.message);
  };

  return (
    <div className="flex-center flex-col gap-3">
      <div className="relative size-36">
        <Image
          fill
          src={preview}
          alt="profile-image"
          className="rounded-full"
        />

        <button
          onClick={clickHandler}
          type="button"
          className="absolute p-2 bottom-0 left-0 rounded-full bg-secondary"
        >
          <HiPencil />
        </button>

        <input
          ref={inputRef}
          onChange={changeHandler}
          type="file"
          accept="image/*"
          className="hidden"
        />
      </div>

      {file && (
        <Button
          onClick={handleUpload}
          width={144}
          icon={<FiUpload className="text-xl" />}
        >
          آپلود
        </Button>
      )}
    </div>
  );
}
