import { redirect } from "next/navigation";

import { connectDB } from "@/lib/config/db";
import Teacher from "@/lib/models/Teacher";

import BulletLabel from "@/components/BulletLabel";
import Profile from "@/components/Profile";
import EditTeacherForm from "@/components/form/EditTeacherForm";

const getTeacherById = async (id: string): Promise<Teacher | undefined> => {
  try {
    await connectDB();
    const teacher = await Teacher.findById(id);
    return teacher?.toObject();
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export default async function PAdminTeacherId({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teacher = await getTeacherById(id);

  if (!teacher) {
    redirect("/not-found");
  }

  return (
    <div className="space-y-8 [&>div]:space-y-5">
      <div>
        <BulletLabel label="ویرایش عکس استاد" />
        <Profile
          userId={`${teacher._id}`}
          defaultImg={{ path: teacher.image.path, url: teacher.image.url }}
          model="TEACHER"
        />
      </div>

      <div>
        <BulletLabel label="ویرایش اطلاعات استاد" />
        <EditTeacherForm {...JSON.parse(JSON.stringify(teacher))} />
      </div>
    </div>
  );
}
