import { connectDB } from "@/lib/config/db";
import Course from "@/lib/models/Course";
import User from "@/lib/models/User";
import "@/lib/models/Category";
import "@/lib/models/Teacher";

import { redirect } from "next/navigation";
import BulletLabel from "@/components/BulletLabel";
import RenderList from "@/components/RenderList";
import PCourseCard from "@/components/PCourseCard";
import Comment from "@/lib/models/Comment";
import Image from "next/image";
import { priceWithDots } from "@/util/price";

const getUserById = async (id: string): Promise<User | undefined> => {
  try {
    await connectDB();
    const user = await User.findById(id);
    return user;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

const getCourses = async (id: string): Promise<Course[]> => {
  try {
    await connectDB();
    const courses = Course.find({ students: id }).populate([
      "teacher",
      "category",
    ]);
    return courses;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getComments = async (id: string): Promise<CommentT[]> => {
  try {
    await connectDB();
    const comments = Comment.find({ user: id }).populate("entityId");
    return comments;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function PAdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    redirect("/register-login");
  }

  const [courses, comments] = await Promise.all([
    getCourses(id),
    getComments(id),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid-center p-4 border border-border rounded-xl space-y-2">
        <div className="relative size-16 mx-auto">
          <Image
            fill
            src={user.image?.url ?? "/images/user-no-image.png"}
            alt="user-profile-image"
            className="rounded-full"
          />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{user.fullname}</h2>
          <p className="text-gray-500 text-sm">
            موجودی کیف پول : {priceWithDots(user.wallet)} تومان
          </p>
        </div>
      </div>

      <div className="space-y-8 [&>div]:space-y-5">
        <div>
          <BulletLabel label="کامنت های ثبت شده : " />

          <RenderList items={comments} alternative="کاربر کامنتی ثبت نکرده">
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        comment.isAccept
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {comment.isAccept ? "تایید شده" : "تایید نشده"}
                    </span>
                  </div>
                  <h2 className="text-lg font-medium">
                    {comment.entityId.title}
                  </h2>
                  <p className="text-gray-700 mt-1">{comment.text}</p>
                </div>
              ))}
            </div>
          </RenderList>
        </div>

        <div>
          <BulletLabel label="دوره های خریداری شده :" />

          <RenderList
            items={courses}
            alternative="هیچکدام از دوره های وبسایت رو خریداری نکردن"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <PCourseCard
                  key={course._id}
                  {...JSON.parse(JSON.stringify(course))}
                />
              ))}
            </div>
          </RenderList>
        </div>
      </div>
    </div>
  );
}
