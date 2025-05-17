import Image from "next/image";
import Link from "next/link";

import { connectDB } from "@/lib/config/db";
import Course from "@/lib/models/Course";
import Comment from "@/lib/models/Comment";
import Blog from "@/lib/models/Blog";

import Button from "@/components/Button";
import CourseCard from "@/components/CourseCard";
import SectionLabel from "@/components/SectionLabel";

import { mainFeatures } from "@/data";

import { GoArrowUpLeft } from "react-icons/go";
import { RiArrowLeftUpLine } from "react-icons/ri";
import CommentsSlider from "@/components/CommentsSlider";
import BlogCard from "@/components/BlogCard";

const getLastCourses = async (): Promise<Course[]> => {
  try {
    await connectDB();
    const courses = await Course.find()
      .limit(6)
      .sort({ createdAt: -1 })
      .populate("teacher")
      .populate("category", "title name");

    return courses;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getLastComments = async (): Promise<CommentT[]> => {
  try {
    await connectDB();
    const comments = await Comment.find({
      isAnswer: false,
      isAccept: true,
    })
      .sort({ createdAt: 1 })
      .limit(2)
      .populate(["user", "entityId"]);

    return comments;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getLastBlogs = async (): Promise<Blog[]> => {
  try {
    await connectDB();
    const blogs = await Blog.find({}).limit(4).sort({ createdAt: -1 });
    return blogs;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default function page() {
  return (
    <div className="space-y-14">
      <Hero />
      <Features />
      <LastestCourses />

      <div className="py-20 overflow-x-hidden">
        <PopularComments />
      </div>

      <LastestBlogs />
    </div>
  );
}

function Hero() {
  return (
    <div className="bg-gradient-to-l from-secondary to-background rounded-2xl p-5">
      <div className="flex flex-col items-center md:flex-row md:justify-evenly gap-10 md:gap-0 py-16">
        <div className="space-y-5">
          <h2 className="font-black text-2xl sm:text-4xl md:text-5xl text-foreground">
            داستان برنامه‌نویس شدنت <br />
            از اینجا شروع میشه!
          </h2>

          <p className="text-muted">
            یادگیری برنامه‌نویسی آرزو نیست، فقط نیاز هست که تلاش و تمرین داشته
            باشید، بقیه‌اش با نابغه
          </p>

          <Button
            width={200}
            href="/courses"
            isLink
            icon={<RiArrowLeftUpLine className="text-xl" />}
          >
            شروع برنامه نویسی
          </Button>
        </div>

        <div className="flex justify-center w-full md:w-72 -order-1 md:order-2">
          <Image
            priority
            width={500}
            height={500}
            src="/images/hero.png"
            alt="hero-image"
          />
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="relative bg-secondary rounded-3xl">
      <div className="relative right-1/2 translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center h-12 bg-background border border-border rounded-2xl font-black text-foreground text-lg text-center px-8">
        چرا آکادمی نابغه ؟
      </div>

      <div className="flex flex-wrap items-center justify-center gap-10 pb-5 md:pb-10 px-5 md:px-10">
        {mainFeatures.map(({ color, icon, id, title }) => (
          <div
            style={{ color: color }}
            key={id}
            className="grid-center space-y-3"
          >
            <span className="grid-center size-20 bg-background rounded-full">
              <span className="text-3xl">{icon}</span>
            </span>
            <span className="font-bold text-sm text-center">{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

async function LastestCourses() {
  const courses = await getLastCourses();

  return (
    <div className="space-y-8">
      <div className="flex-between-center gap-8 bg-gradient-to-l from-secondary to-background rounded-2xl p-5">
        <SectionLabel title="آخرین دوره های" text="منتشر شده" />

        <Link
          className="size-12 sm:w-auto flex-center gap-2 bg-secondary rounded-full text-foreground transition-colors hover:text-primary sm:px-4"
          href="/courses"
        >
          <span className="font-bold hidden sm:block">مشاهده همه</span>
          <GoArrowUpLeft className="font-bold text-xl" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}

async function PopularComments() {
  const comments = await getLastComments();

  return (
    <div className="space-y-5 md:grid md:grid-cols-12 md:gap-10 md:space-y-0">
      <SectionLabel
        styles="md:col-span-4"
        title="در مورد نابغه چه میشنویم؟"
        text="این‌ها، بخش خیلی کوچکی از نظراتی هستند که افراد مختلف در مورد نابغه دارند."
      />

      <div className="w-full max-w-xl mx-auto md:col-span-8">
        <CommentsSlider comments={JSON.parse(JSON.stringify(comments))} />
      </div>
    </div>
  );
}

async function LastestBlogs() {
  const blogs = await getLastBlogs();

  return (
    <div className="bg-gradient-to-l from-secondary to-background rounded-2xl p-5 sm:p-10 lg:flex lg:items-center lg:gap-10">
      <SectionLabel
        styles="mb-8 lg:w-4/12 lg:mb-0"
        title="از گوشه و اطراف دنیای برنامه‌نویسی"
        text="نوشتن کار جالبیه که از هزاران سال همراه ما بوده و کمک کرده تا همیشه به روز باشیم، ما در نابغه فضای رو به شکلی آماده کردیم تا شما بتونید ایده‌ها و مطالب جالب حوزه برنامه‌نویسی رو در اختیار هزاران برنامه‌نویس عضو نابغه قرار بدید."
      />

      <div className="w-full lg:w-8/12 lg:mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-8 space-y-8">
          <div className="space-y-5">
            {blogs.slice(0, 2).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
          <div className="space-y-5">
            {blogs.slice(2, 4).map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
