"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "./Button";
import { RiArrowLeftUpLine } from "react-icons/ri";
import { addToCart } from "@/actions/user";
import { toast } from "react-toastify";

type AddToCartProps = {
  userId: string | undefined;
  courseId: string;
};

export default function AddToCart({ courseId, userId }: AddToCartProps) {
  const redirectPath = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const redirectHandler = () => {
    const params = new URLSearchParams(searchParams);
    params.set("r", redirectPath);

    replace(`/register-login?${params.toString()}`);
  };

  const addToCartHandler = async (userId: string) => {
    const { success, message } = await addToCart(userId, courseId);

    if (success) {
      toast.success(message);
      return;
    }

    toast.error(message);
  };

  return (
    <Button
      icon={<RiArrowLeftUpLine className="text-xl" />}
      onClick={() => (userId ? addToCartHandler(userId) : redirectHandler())}
    >
      اضافه به سبد خرید
    </Button>
  );
}
