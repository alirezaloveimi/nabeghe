import React from "react";
import { FaHeart } from "react-icons/fa";
import Button from "./Button";
import Image from "next/image";

export default function BlogCard({ blog }: { blog: Blog }) {
  const { _id, author, cover, createdAt, likes, title } = blog;

  return (
    <div className="relative bg-background rounded-xl p-4">
      <div className="relative mb-5 z-20">
        <Image
          src={cover.url}
          width={500}
          height={500}
          alt="blog-cover"
          className="max-w-full rounded-xl"
        />
      </div>

      <div className="relative space-y-2 z-10">
        <h2 className="font-bold line-clamp-1">{title}</h2>

        <div className="flex justify-between items-center text-sm text-gray-500 pb-4">
          <div className="space-y-1">
            <p>نویسنده : {author}</p>
            <p className="text-xs">
              تاریخ انتشار : {new Date(createdAt).toLocaleDateString("fa-IR")}
            </p>
          </div>

          <div className="flex items-center gap-1 text-red-500">
            <FaHeart />
            <span>{likes.length}</span>
          </div>
        </div>

        <Button isLink href={`/blogs/${_id}`}>
          مشاهده وبلاگ
        </Button>
      </div>
    </div>
  );
}
