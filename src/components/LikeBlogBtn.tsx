"use client";

import { toggleLike } from "@/actions/blog";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

type LikeBlogBtnProps = {
  isLike: boolean;
  likes: number;
  userId: string | undefined;
  blogId: string;
};

export default function LikeBlogBtn({
  isLike,
  likes,
  blogId,
  userId,
}: LikeBlogBtnProps) {
  const toggleLikeHandler = async () => {
    const { message, success } = await toggleLike(userId, blogId);

    if (success) {
      toast.success(message);
      return;
    }

    toast.error(message);
  };

  return (
    <button
      onClick={toggleLikeHandler}
      type="button"
      className="flex-align-center mr-auto py-1 px-3 rounded-md gap-x-1.5 bg-red-500/10 text-red-500 transition hover:bg-red-500/20"
    >
      <span>{isLike ? <FaHeart /> : <FaRegHeart />}</span>
      <span>{likes}</span>
    </button>
  );
}
