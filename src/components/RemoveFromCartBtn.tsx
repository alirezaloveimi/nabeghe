"use client";

import { removeFromCart } from "@/actions/user";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

type RemoveFromCartBtnProps = {
  userId: string;
  courseId: string;
};

export default function RemoveFromCartBtn({
  courseId,
  userId,
}: RemoveFromCartBtnProps) {
  const { refresh } = useRouter();

  const removeCourseFromCartHandler = async () => {
    const { message, success } = await removeFromCart(userId, courseId);

    if (success) {
      toast.success(message, { onClose: () => refresh() });
      return;
    }

    toast.error(message);
  };

  return (
    <button
      onClick={removeCourseFromCartHandler}
      type="button"
      className="absolute right-1/2 translate-x-1/2 -translate-y-6 size-11 grid-center rounded-full bg-red-500 text-white"
    >
      <IoMdClose className="text-xl" />
    </button>
  );
}
