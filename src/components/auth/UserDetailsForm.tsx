"use client";
import { useActionState } from "react";

import { toast } from "react-toastify";
import { toastCallback } from "@/util/toast";
import { sendOtpRegister } from "@/actions/auth";
import { useAuth } from "@/context/AuthProvider";

import BulletLabel from "../BulletLabel";
import InputField from "../InputField";
import Button from "../Button";

export default function UserDetailsForm() {
  const { userInfo, updateUserInfo, toggleUserForm, toggleOtpSignup } =
    useAuth();

  const [state, action, pending] = useActionState(
    toastCallback(sendOtpRegister, {
      onError(result) {
        toast.error(result.message);
      },
      onSuccess(result) {
        toast.success(result.message, {
          onClose: () => {
            toggleOtpSignup(true, result.expTime);
          },
        });
      },
    }),
    undefined
  );

  return (
    <div className="space-y-3">
      <BulletLabel label="به نابغه خوش آمدید" />

      <form action={action} className="space-y-3">
        <InputField
          label="نام و نام خانوادگی خود را وارد کنید"
          id="fullname"
          name="fullname"
          value={userInfo.fullname}
          onChange={({ target }) => updateUserInfo(target.name, target.value)}
          error={state?.errors?.fullname}
        />

        <InputField
          label="شماره موبایل خود را وارد کنید"
          id="phone"
          name="phone"
          value={userInfo.phone}
          onChange={({ target }) => updateUserInfo(target.name, target.value)}
          error={state?.errors?.phone}
        />

        <Button pending={pending} type="submit">
          ثبت نام
        </Button>
      </form>

      <button
        onClick={() => toggleUserForm(false)}
        className="w-full text-center text-primary font-bold underline"
        type="button"
      >
        قبلا ثبت نام کردم
      </button>
    </div>
  );
}
