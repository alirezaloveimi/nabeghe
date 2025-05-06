import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import Button from "./Button";
import Link from "next/link";
import { IoEye, IoPencilSharp, IoTrash } from "react-icons/io5";

const PBlogCard = ({
  _id,
  title,
  description,
  author,
  cover,
  likes,
  createdAt,
  isAdmin = true,
}: Blog & { isAdmin: boolean }) => {
  return (
    <div className="bg-secondary rounded-xl overflow-hidden flex flex-col">
      <div className="relative w-full h-48">
        <Image src={cover.url} alt="blog-cover" fill />
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-xl font-bold mb-2 line-clamp-1">{title}</h2>
          <p className="text-muted line-clamp-2 mb-4">{description}</p>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <p>نویسنده : {author}</p>
          <div className="flex items-center gap-1 text-red-500">
            <FaHeart />
            <span>{likes.length}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          تاریخ انتشار : {new Date(createdAt).toLocaleDateString("fa-IR")}
        </p>

        {isAdmin ? (
          <div className="flex-align-center justify-end gap-x-3">
            <Link
              href={`/p-admin/blogs/${_id}`}
              className="p-2 rounded-md border border-border hover:bg-input transition"
            >
              <IoPencilSharp className="text-foreground text-lg" />
            </Link>

            <Link
              href={`/blogs/${_id}`}
              className="p-2 rounded-md border border-border hover:bg-input transition"
            >
              <IoEye className="text-foreground text-lg" />
            </Link>

            <button className="p-2 rounded-md border border-border hover:bg-input transition">
              <IoTrash className="text-red-600 text-lg" />
            </button>
          </div>
        ) : (
          <Button href={`/blogs/${_id}`} isLink>
            مشاهده وبلاگ
          </Button>
        )}
      </div>
    </div>
  );
};

export default PBlogCard;
