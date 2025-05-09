import { connectDB } from "@/lib/config/db";
import Course from "@/lib/models/Course";
import "@/lib/models/Category";
import "@/lib/models/Teacher";

import CourseCard from "./CourseCard";
import RenderList from "./RenderList";

type CourseListProps = {
  category: string;
  type: string;
};

const getFiltredCourse = async (
  type: string,
  category: string
): Promise<Course[]> => {
  try {
    await connectDB();
    const courses = await Course.find({})
      .sort({ createdAt: -1 })
      .populate("teacher")
      .populate("category", "title name");

    let filteredCourses = category
      ? courses.filter((course) => course.category?.name === category)
      : courses;

    switch (type) {
      case "free": {
        filteredCourses = filteredCourses.filter((course) => {
          const finalPrice =
            course.price - (course.price * course.discount) / 100;
          return !course.price || finalPrice <= 0;
        });
        break;
      }
      case "cash": {
        filteredCourses = filteredCourses.filter((course) => {
          const finalPrice =
            course.price - (course.price * course.discount) / 100;
          return finalPrice > 0;
        });
        break;
      }
    }

    return filteredCourses;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function CourseList({ type, category }: CourseListProps) {
  const courses = await getFiltredCourse(type, category);

  return (
    <div>
      <RenderList items={courses} alternative="دوره ایی یافت نشد">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </RenderList>
    </div>
  );
}
