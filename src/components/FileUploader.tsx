"use client";

import { ChangeEvent } from "react";
import { LuUpload } from "react-icons/lu";

type FileUploaderProps = {
  file: File | null;
  onChange: (file: File) => void;
  label: string;
  height: number;
  name: string;
  error?: string[];
};

export default function FileUploader({
  label,
  height,
  name,
  onChange,
  file,
  error,
}: FileUploaderProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      <span className="text-sm text-muted">{label}</span>

      <div className="flex-center">
        <label
          style={{ height }}
          className="flex-center flex-col w-full h-64 border-2 bg-secondary border-border border-dashed rounded-lg cursor-pointer"
        >
          <div className="py-5">
            {!file && (
              <div className="text-center space-y-2">
                <LuUpload className="text-3xl mx-auto" />
                <p className="text-sm text-muted">برای آپلود کلیک کنید</p>
              </div>
            )}

            {file && (
              <div className="space-y-1">
                <p className="text-sm text-muted">
                  فایل انتخابی شما : {file.name}
                </p>

                <p className="text-sm text-muted text-center">
                  سایز : KB {(file.size / 1024).toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            name={name}
          />
        </label>
      </div>

      {error && <p className="text-xs font-bold text-red-500">{error[0]}</p>}
    </div>
  );
}
