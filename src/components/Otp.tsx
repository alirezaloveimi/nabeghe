"use client";
import { useRef } from "react";

type OtpProps = {
  otp: string[];
  error?: string[];
  updateOtp: (updatedOtp: string[]) => void;
};

export default function Otp({ otp, updateOtp, error }: OtpProps) {
  const otpsRef = useRef<(HTMLInputElement | null)[]>([]);

  const changeHandler = (newValue: string, index: number) => {
    if (isNaN(+newValue)) return;

    const newOtp = otp.map((value, i) => (i === index ? newValue : value));
    updateOtp(newOtp);

    if (newValue.length && otp.length - 1 > index) {
      otpsRef.current[index + 1]?.focus();
    }
  };

  const keyDownHandler = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-3">
      <div style={{ direction: "ltr" }} className="flex-center gap-x-3">
        {otp.map((value, index) => (
          <input
            key={index}
            value={value}
            type="text"
            className="size-10 text-center rounded-md shadow"
            maxLength={1}
            onChange={(e) => changeHandler(e.target.value, index)}
            onKeyDown={(e) => keyDownHandler(e.key, index)}
            ref={(elm) => {
              if (elm) otpsRef.current[index] = elm;
            }}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs font-bold text-red-500 text-center">{error[0]}</p>
      )}
    </div>
  );
}
