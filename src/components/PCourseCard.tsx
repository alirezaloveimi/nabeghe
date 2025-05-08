import Link from "next/link";
import Image from "next/image";
import PriceContent from "./PriceContent";

import { IoEye, IoPencilSharp } from "react-icons/io5";
import Button from "./Button";
import DeleteEntity from "./DeleteEntity";
import { deleteCourse } from "@/actions/course";

export default function PCourseCard({
  _id,
  category,
  cover,
  title,
  teacher,
  price,
  discount,
  isAdmin = true,
}: Course & { isAdmin?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary p-4 space-y-4">
      <div className="w-full relative">
        <Image
          width={500}
          height={500}
          src={cover.url}
          alt={title}
          className="object-cover rounded-xl mb-4"
        />

        {discount > 0 && (
          <div className="absolute right-0 -top-4 size-10 grid-center rounded-full bg-primary text-white text-xs font-bold">
            {discount}%
          </div>
        )}
      </div>

      <h4 className="font-bold line-clamp-1 text-foreground">{title}</h4>

      <div className="flex flex-col text-sm text-muted">
        <span>دسته بندی :{category.title}</span>
        <span>استاد دوره : {teacher.title}</span>
      </div>

      {isAdmin && (
        <>
          <PriceContent discount={discount} price={price} />

          <div className="flex-align-center justify-end gap-x-3">
            <Link
              href={`/p-admin/courses/${_id}`}
              className="p-2 rounded-md border border-border hover:bg-input transition"
            >
              <IoPencilSharp className="text-foreground text-lg" />
            </Link>

            <Link
              href={`/courses/${_id}`}
              className="p-2 rounded-md border border-border hover:bg-input transition"
            >
              <IoEye className="text-foreground text-lg" />
            </Link>

            <DeleteEntity
              id={`${_id}`}
              action={deleteCourse}
              label="آیا از حذف دوره اطمینان دارید ؟"
            />
          </div>
        </>
      )}

      {!isAdmin && (
        <Button href={`/courses/${_id}`} isLink>
          مشاهده دوره
        </Button>
      )}
    </div>
  );
}
