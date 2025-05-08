import Image from "next/image";
import Link from "next/link";

import { connectDB } from "@/lib/config/db";
import Teacher from "@/lib/models/Teacher";
import "@/lib/models/Course";

import BulletLabel from "@/components/BulletLabel";
import Button from "@/components/Button";
import RenderList from "@/components/RenderList";
import SeeTeacherCourses from "@/components/SeeTeacherCourses";

const getTeachers = async (): Promise<Teacher[]> => {
  try {
    await connectDB();
    const teachers = await Teacher.find({})
      .populate({ path: "courses", model: "Course" })
      .sort({ createdAt: -1 });
    return teachers;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default function PAdminTeachersPage() {
  return (
    <div className="space-y-8">
      <div className="flex-between-center">
        <BulletLabel label="تمامی استاد های وبسایت" />
        <Button width={180} isLink href="/p-admin/teachers/add">
          اضافه کردن استاد جدید
        </Button>
      </div>

      <TeachersList />
    </div>
  );
}

async function TeachersList() {
  const teachers = await getTeachers();

  return (
    <RenderList items={teachers} alternative="استادی در وبسایت وجود ندارد">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <TeacherCard
            key={teacher._id}
            {...JSON.parse(JSON.stringify(teacher))}
          />
        ))}
      </div>
    </RenderList>
  );
}

function TeacherCard({ about, courses, image, name, title, _id }: Teacher) {
  return (
    <div className="rounded-2xl border border-border bg-secondary p-6 flex-align-center flex-col">
      <Image
        src={image.url}
        alt={name}
        width={96}
        height={96}
        className="rounded-full object-cover mb-4 border-4 border-border"
      />

      <h2 className="text-lg font-semibold text-foreground text-center">
        {title}
      </h2>

      <p className="text-sm text-muted text-center mt-2 line-clamp-2">
        {about}
      </p>

      <div className="text-sm text-foreground mt-3 bg-input px-3 py-1 rounded-full">
        {courses.length} دوره
      </div>

      <div className="w-full mt-6 flex flex-col md:flex-row [&>*]:flex-1 gap-3">
        <Link
          href={`/p-admin/teachers/${_id}`}
          className="text-center py-2 text-sm rounded-md border border-border hover:bg-input transition"
        >
          ویرایش
        </Link>

        <SeeTeacherCourses courses={courses} />
      </div>
    </div>
  );
}
