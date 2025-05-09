import Image from "next/image";
import { redirect } from "next/navigation";

import { connectDB } from "@/lib/config/db";
import Course from "@/lib/models/Course";
import "@/lib/models/Teacher";
import "@/lib/models/User";

import DOMPurify from "isomorphic-dompurify";

import BulletLabel from "@/components/BulletLabel";
import PriceContent from "@/components/PriceContent";
import AddToCart from "@/components/AddToCart";
import AddComment from "@/components/AddComment";
import RenderList from "@/components/RenderList";
import Comment from "@/components/Comment";

import { getUser } from "@/util/user";
import { FaRegUser } from "react-icons/fa";
import { createComment } from "@/actions/comment";
import { getCommentById } from "@/util/comment";
import { BsFillClockFill } from "react-icons/bs";
import { MdInfoOutline } from "react-icons/md";
import { FiUsers } from "react-icons/fi";

type StickyCourseInfoProps = {
  isMember: boolean;
  teacher: Teacher;
  courseId: string;
  bill: { price: number; discount: number };
  userId: string | undefined;
};

type CourseContentProps = {
  course: Course;
  user: User | undefined;
  comments: CommentT[];
};

const getCourseById = async (id: string): Promise<Course | undefined> => {
  try {
    await connectDB();

    const course = await Course.findOne({ _id: id })
      .populate("teacher", "image title about")
      .populate("students");

    return course;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();

  const [course, comments] = await Promise.all([
    getCourseById(id),
    getCommentById(id, "Course"),
  ]);

  if (!course) {
    redirect("/not-found");
  }

  const isMember = course.students.some(
    (studentId) => studentId._id.toString() === user?._id.toString()
  );

  return (
    <div className="space-y-14">
      <div className="flex flex-wrap items-start md:flex-nowrap gap-5">
        <CourseContent comments={comments} course={course} user={user} />

        <StickyCourseInfo
          isMember={isMember}
          bill={{ price: course.price, discount: course.discount }}
          teacher={course.teacher}
          userId={user ? `${user._id}` : undefined}
          courseId={id}
        />
      </div>
    </div>
  );
}

function StickyCourseInfo({
  isMember,
  bill,
  teacher,
  courseId,
  userId,
}: StickyCourseInfoProps) {
  let content;
  if (isMember) {
    content = (
      <div className="flex-align-center gap-x-3">
        <FaRegUser className="text-xl" />
        <p className="text-primary font-bold">شما دانشجوی دوره هستید</p>
      </div>
    );
  } else {
    content = <AddToCart courseId={courseId} userId={userId} />;
  }

  return (
    <div className="w-full lg:w-4/12 lg:sticky lg:top-24 space-y-8">
      <div className="bg-gradient-to-b from-secondary to-background rounded-2xl px-5 pb-5 space-y-3">
        <div className="bg-background rounded-b-3xl p-5 mb-5 space-y-2">
          <BulletLabel label="نام نویسی در دوره" />
        </div>

        {!isMember && (
          <div className="flex items-center justify-between gap-5">
            <span className="font-bold text-base text-muted">
              هزینه ثبت نام:
            </span>

            <PriceContent discount={bill.discount} price={bill.price} />
          </div>
        )}

        {content}
      </div>

      <div className="space-y-5">
        <BulletLabel label="مدرس دوره" />

        <div className="space-y-3">
          <div className="flex-align-center gap-x-3">
            <Image
              alt="teacher-image"
              width={40}
              height={40}
              src={teacher.image.url}
              className="rounded-full object-cover"
            />
            <div className="space-y-1">
              <h5 className="font-bold text-sm text-foreground">
                {teacher.title}
              </h5>
            </div>
          </div>
          <div className="bg-secondary rounded-tl-3xl rounded-b-3xl p-5">
            <p className="line-clamp-3 text-muted">{teacher.about}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseContent({ course, user, comments }: CourseContentProps) {
  return (
    <div className="w-full lg:w-8/12">
      <div className="relative">
        <div className="relative z-10">
          <Image
            alt="course-cover"
            src={course.cover.url}
            className="size-full rounded-3xl object-cover"
            priority={true}
            width={500}
            height={500}
          />
        </div>
        <div className="-mt-12 pt-12"></div>
      </div>

      <div className="bg-gradient-to-b from-background to-secondary rounded-b-3xl space-y-2 p-5 mx-5">
        <h3 className="font-bold text-xl text-foreground">{course.title}</h3>

        <p className="text-sm text-muted line-clamp-3 sm:line-clamp-3">
          {course.description}
        </p>
      </div>

      <div className="space-y-10 [&>div]:space-y-5 py-5">
        <CourseFeatures
          students={course.students.length}
          time={course.time}
          status={course.status}
        />

        <div>
          <BulletLabel label="درباره دوره" />

          <div
            className="prose prose-lg dark:prose-invert max-w-none [&>img]:rounded-3xl [&>img]:shadow [&>img]:!cursor-default"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(course.html),
            }}
          />
        </div>

        <div>
          <BulletLabel label="جلسات دوره" />
          <div className="bg-secondary h-60"></div>
        </div>

        <div>
          <AddComment
            entityType="Course"
            user={JSON.parse(JSON.stringify(user))}
            id={`${course._id}`}
            action={createComment}
          />

          <RenderList alternative="کامنتی ثبت نشده" items={comments}>
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                students={course.students}
              />
            ))}
          </RenderList>
        </div>
      </div>
    </div>
  );
}

function CourseFeatures({
  students,
  time,
  status,
}: {
  students: number;
  time: number;
  status: CourseStatus;
}) {
  let statusContent = "";

  switch (status) {
    case "COMPLATE": {
      statusContent = "تکمیل شده";
      break;
    }
    case "PRESALE": {
      statusContent = "پیشفروش";
      break;
    }
    case "INPROGRESS": {
      statusContent = "در حال برگزاری";
      break;
    }
  }

  const courseFeatures = [
    { id: 1, title: "مدت دوره", value: time, icon: <BsFillClockFill /> },
    {
      id: 2,
      title: "وضیت دوره",
      value: statusContent,
      icon: <MdInfoOutline />,
    },
    {
      id: 3,
      title: "تعداد شرکت کنندگان",
      value: students,
      icon: <FiUsers />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
      {courseFeatures.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center justify-center gap-3 bg-secondary border border-border rounded-2xl p-3"
        >
          <div className="grid-center size-12 bg-background rounded-full text-primary">
            <span className="text-2xl">{item.icon}</span>
          </div>

          <div className="space-y-1 text-center">
            <p className="font-bold text-xs text-muted line-clamp-1">
              {item.title}
            </p>
            <p className="font-bold text-foreground line-clamp-1">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
