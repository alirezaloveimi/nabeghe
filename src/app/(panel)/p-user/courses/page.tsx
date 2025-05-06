import { connectDB } from "@/lib/config/db";
import Course from "@/lib/models/Course";
import "@/lib/models/Teacher";
import "@/lib/models/Category";

import { getUser } from "@/util/user";
import BulletLabel from "@/components/BulletLabel";
import RenderList from "@/components/RenderList";
import PCourseCard from "@/components/PCourseCard";

const getMyCourse = async (userId: string): Promise<Course[]> => {
  try {
    await connectDB();
    const courses = await Course.find({ students: userId }).populate([
      "category",
      "teacher",
    ]);
    if (!courses) return [];

    return courses;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function PUserCoursesPage() {
  const user = await getUser();
  const courses = await getMyCourse(user?._id || "");

  return (
    <div className="space-y-8">
      <BulletLabel label={`دوره های من (${courses.length})`} />
      <AllMyCourses courses={courses} />
    </div>
  );
}

function AllMyCourses({ courses }: { courses: Course[] }) {
  return (
    <RenderList items={courses} alternative="شما در دوره ایی ثبت نام نکردید">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <PCourseCard
            isAdmin={false}
            key={course._id}
            {...JSON.parse(JSON.stringify(course))}
          />
        ))}
      </div>
    </RenderList>
  );
}
