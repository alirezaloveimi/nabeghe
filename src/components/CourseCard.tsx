import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

import { IoGrid } from "react-icons/io5";
import { RiArrowLeftUpLine } from "react-icons/ri";
import PriceContent from "./PriceContent";

export default function CourseCard({ course }: { course: Course }) {
  const { category, price, title, discount, cover, teacher, _id } = course;

  return (
    <div className="relative">
      <div className="relative z-10">
        <Image
          quality={100}
          alt="course-image"
          width={500}
          height={500}
          src={cover.url}
          className="rounded-3xl object-cover max-w-full"
        />
        <div className="flex-align-center gap-x-2 absolute left-3 top-3 h-11 bg-black/20 rounded-full text-white transition-all hover:opacity-80 px-4">
          <IoGrid className="text-lg" />
          <span>{category.title}</span>
        </div>

        {discount > 0 && (
          <div className="absolute right-0 -top-4 size-10 grid-center rounded-full bg-primary text-white text-xs font-bold">
            {discount}%
          </div>
        )}
      </div>

      <div className="bg-background rounded-b-3xl -mt-12 pt-12">
        <div className="bg-gradient-to-b from-background to-secondary rounded-b-3xl space-y-2 p-5 mx-5">
          <Link
            href={`/courses/${_id}`}
            className="font-bold text-sm line-clamp-1 text-foreground transition-colors hover:text-primary"
          >
            {title}
          </Link>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center md:gap-0">
            <div className="flex-align-center gap-x-3">
              <Image
                width={40}
                height={40}
                src={teacher.image.url}
                alt={teacher.name}
                className="rounded-full"
              />

              <p className="font-bold text-muted text-sm space-y-1">
                مدرس دوره :
                <br />
                <span className="inline-block text-foreground">
                  {teacher.title}
                </span>
              </p>
            </div>

            <PriceContent discount={discount} price={price} />
          </div>

          <Button
            isLink
            href={`/courses/${_id}`}
            icon={<RiArrowLeftUpLine className="text-xl" />}
          >
            مشاهده دوره
          </Button>
        </div>
      </div>
    </div>
  );
}
