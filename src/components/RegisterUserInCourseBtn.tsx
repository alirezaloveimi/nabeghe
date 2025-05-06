"use client";

import Button from "./Button";
import { registerToCourse } from "@/actions/course";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type RegisterUserInCourseBtnProps = {
  userId: string;
  cartPrice: number;
};

export default function RegisterUserInCourseBtn({
  cartPrice,
  userId,
}: RegisterUserInCourseBtnProps) {
  const { refresh } = useRouter();

  const clickHandler = async () => {
    const { message, success } = await registerToCourse(userId, cartPrice);

    if (success) {
      toast.success(message, {
        onClose() {
          refresh();
        },
      });
      return;
    }

    toast.error(message);
  };

  return <Button onClick={clickHandler}>خرید</Button>;
}
