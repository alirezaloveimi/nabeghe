import { connectDB } from "@/lib/config/db";
import Course from "@/lib/models/Course";
import "@/lib/models/Category";
import "@/lib/models/Teacher";

import BulletLabel from "@/components/BulletLabel";
import EditCourseForm from "@/components/form/EditCourseForm";
import { redirect } from "next/navigation";

const getCourseById = async (id: string): Promise<Course | undefined> => {
  try {
    await connectDB();
    const course = await Course.findOne({ _id: id })
      .populate("category")
      .populate("teacher");

    return course;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export default async function PAdminEditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    redirect("/not-found");
  }

  return (
    <div className="space-y-8">
      <BulletLabel label="آپدیت اطلاعات دوره" />
      <EditCourseForm {...JSON.parse(JSON.stringify(course))} />
    </div>
  );
}
