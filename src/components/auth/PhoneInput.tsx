"use client";
import { useActionState } from "react";

import { sendOtpLogin } from "@/actions/auth";
import { toastCallback } from "@/util/toast";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "react-toastify";

import BulletLabel from "../BulletLabel";
import InputField from "../InputField";
import Button from "../Button";

export default function PhoneInput() {
  const { phone, phoneInputChange, toggleUserForm, toggleOtpSignup } =
    useAuth();

  const [state, action, pending] = useActionState(
    toastCallback(sendOtpLogin, {
      onError(result) {
        toast.error(result.message);
      },
      onSuccess(result) {
        toast.success(result.message, {
          onClose: () => {
            toggleOtpSignup(true, result.expTime, String(result.code));
          },
        });
      },
    }),
    undefined
  );

  return (
    <div className="space-y-3">
      <BulletLabel label="ورود یا ثبت نام" />
      <p className="text-sm text-muted">سلام و درود 👋</p>

      <form action={action} className="space-y-3">
        <InputField
          id="phone"
          label="شماره موبایل"
          name="phone"
          value={phone}
          onChange={(e) => phoneInputChange(e.target.value)}
          error={state?.errors?.phone}
        />

        <Button type="submit" pending={pending}>
          برو بریم
        </Button>
      </form>

      <button
        onClick={() => toggleUserForm(true)}
        className="w-full text-center text-primary font-bold underline"
        type="button"
      >
        ثبت نام
      </button>
    </div>
  );
}
