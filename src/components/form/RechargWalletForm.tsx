"use client";
import { useActionState } from "react";

import { rechargeWallet } from "@/actions/user";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";

import InputField from "../InputField";
import Button from "../Button";

export default function RechargWalletForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    toastCallback(rechargeWallet, {
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
      <InputField
        label="مقدار مبلغ افزایشی"
        type="number"
        name="price"
        defaultValue={state?.inputs?.price}
        error={state?.errors?.price}
      />

      <input type="hidden" name="id" value={id} />

      <Button type="submit" pending={pending}>
        اضافه به کیف پول
      </Button>
    </form>
  );
}
