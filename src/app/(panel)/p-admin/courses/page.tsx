import { connectDB } from "@/lib/config/db";
import Course from "@/lib/models/Course";

import BulletLabel from "@/components/BulletLabel";
import Button from "@/components/Button";
import PCourseCard from "@/components/PCourseCard";
import RenderList from "@/components/RenderList";

const getCourses = async (): Promise<Course[]> => {
  try {
    await connectDB();
    const courses = await Course.find({})
      .sort({ createdAt: -1 })
      .populate("teacher")
      .populate("category");

    return courses;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function PAdminCoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-8">
      <div className="flex-between-center">
        <BulletLabel label={`تمامی دوره های وبسایت (${courses.length})`} />
        <Button width={180} isLink href="/p-admin/courses/add">
          اضافه کردن دوره جدید
        </Button>
      </div>

      <AllCourses courses={courses} />
    </div>
  );
}

function AllCourses({ courses }: { courses: Course[] }) {
  return (
    <RenderList items={courses} alternative="دوره ایی در وبسایت وجود ندارد">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <PCourseCard
            key={course._id}
            {...JSON.parse(JSON.stringify(course))}
          />
        ))}
      </div>
    </RenderList>
  );
}
