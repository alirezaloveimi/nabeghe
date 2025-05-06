"use client";

import { useAuth } from "@/context/AuthProvider";
import { LuArrowLeft } from "react-icons/lu";
import BulletLabel from "../BulletLabel";
import { useActionState } from "react";
import Otp from "../Otp";
import Button from "../Button";
import { toastCallback } from "@/util/toast";
import { verifyCode } from "@/actions/auth";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtp() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("r") || "";

  const {
    timer,
    userInfo,
    toggleOtpLogin,
    toggleOtpSignup,
    phone,
    otp,
    updateOtp,
  } = useAuth();

  const [state, action, pending] = useActionState(
    toastCallback(verifyCode, {
      onError(result) {
        toast.error(result.message);
      },
      onSuccess(result) {
        toast.success(result.message, {
          onClose: () => {
            push(redirectPath || "/");
          },
        });
      },
    }),
    undefined
  );

  const isNewUser = Boolean(userInfo.fullname);

  const backToPrevStep = () => {
    if (isNewUser) {
      toggleOtpSignup(false);
      return;
    }

    toggleOtpLogin(false);
  };

  const otpAction = (formData: FormData) => {
    formData.append("code", otp.join(""));
    formData.append("info", phone || JSON.stringify(userInfo));
    action(formData);
  };

  return (
    <div className="space-y-3">
      <div className="flex-between-center text-foreground">
        <BulletLabel label="کد تایید را وارد کنید" />
        <button
          type="button"
          onClick={backToPrevStep}
          className="size-10 grid-center bg-secondary rounded-full"
        >
          <LuArrowLeft className="text-xl" />
        </button>
      </div>

      <div className="flex justify-center">
        <span className="font-black">{timer}</span>
      </div>

      <p className="text-sm text-muted">
        پیامکی به شماره : {isNewUser ? userInfo.phone : phone} ارسال شد، آن را
        وارد کنید
      </p>

      <form className="space-y-4" action={otpAction}>
        <Otp
          error={state?.errors?.code}
          otp={otp}
          updateOtp={(updatedOtp) => updateOtp(updatedOtp)}
        />

        <Button type="submit" pending={pending}>
          تایید
        </Button>
      </form>
    </div>
  );
}
