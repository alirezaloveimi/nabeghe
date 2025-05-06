"use client";

import { useActionState } from "react";
import InputField from "../InputField";
import Button from "../Button";
import { toastCallback } from "@/util/toast";
import { editInfo } from "@/actions/user";
import { toast } from "react-toastify";

type EditUserInfoProps = {
  phone: string;
  fullname: string;
};

export default function EditInfo({ fullname, phone }: EditUserInfoProps) {
  const [state, action, pending] = useActionState(
    toastCallback(editInfo, {
      onError(result) {
        toast.error(result.message);
      },
      onSuccess(result) {
        toast.success(result.message);
      },
    }),
    undefined
  );

  return (
    <form action={action} className="space-y-3">
      <div className="flex gap-4 flex-col md:flex-row [&>div]:md:flex-1">
        <input className="hidden" name="phone" value={phone} type="hidden" />

        <InputField
          type="text"
          label="نام و نام خانوادگی"
          name="fullname"
          defaultValue={state?.inputs?.fullname || fullname}
          error={state?.errors?.fullname}
        />

        <InputField
          type="text"
          label="شماره موبایل"
          disabled
          defaultValue={phone}
        />
      </div>

      <Button type="submit" pending={pending}>
        بروز رسانی اطلاعات
      </Button>
    </form>
  );
}
