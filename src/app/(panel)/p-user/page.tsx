import BulletLabel from "@/components/BulletLabel";
import PBlogCard from "@/components/PBlogCard";
import PCourseCard from "@/components/PCourseCard";
import RenderList from "@/components/RenderList";
import { connectDB } from "@/lib/config/db";
import Blog from "@/lib/models/Blog";
import Course from "@/lib/models/Course";
import { priceWithDots } from "@/util/price";
import { getUser } from "@/util/user";
import { redirect } from "next/navigation";

type StatsCardProps = {
  title: string;
  value: number | string;
};

const getUserCourses = async (
  id: string
): Promise<{ totalCourses: number; courses: Course[] }> => {
  try {
    await connectDB();
    const [totalCourses, courses] = await Promise.all([
      Course.find({ students: id }).countDocuments(),
      Course.find({ students: id }).populate(["teacher", "category"]).limit(3),
    ]);

    return { totalCourses, courses };
  } catch (e) {
    console.log(e);
    return { totalCourses: 0, courses: [] };
  }
};

const getUserBlogs = async (
  id: string
): Promise<{ totalBlogs: number; blogs: Blog[] }> => {
  try {
    await connectDB();
    const [totalBlogs, blogs] = await Promise.all([
      Blog.find({ likes: id }).countDocuments(),
      Blog.find({ likes: id }).limit(3),
    ]);

    return { totalBlogs, blogs };
  } catch (e) {
    console.log(e);
    return { totalBlogs: 0, blogs: [] };
  }
};

export default async function PUserPage() {
  const user = await getUser();

  if (!user) {
    redirect("/register-login");
  }

  const [{ courses, totalCourses }, { blogs, totalBlogs }] = await Promise.all([
    getUserCourses(user._id),
    getUserBlogs(user._id),
  ]);

  return (
    <div className="space-y-8 [&>div]:space-y-8">
      <div>
        <BulletLabel label="پنل کاربر" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard title="تعداد دوره های من" value={totalCourses} />
          <StatsCard title="تعداد وبلاگ های لایک شده من" value={totalBlogs} />
          <StatsCard
            title="موجودی کیف پول من"
            value={priceWithDots(user.wallet) + " " + "تومان"}
          />
        </div>
      </div>

      <div>
        <BulletLabel label="اخرین دوره های من" />
        <MyCourses courses={courses} />
      </div>

      <div>
        <BulletLabel label="اخرین وبلاگ های لایک شده ی من" />
        <MyBlogs blogs={blogs} />
      </div>
    </div>
  );
}

function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-secondary p-4 rounded-xl text-center">
      <h3 className="text-muted">{title}</h3>
      <p className="text-xl font-bold mt-2">{value}</p>
    </div>
  );
}

function MyCourses({ courses }: { courses: Course[] }) {
  return (
    <RenderList items={courses} alternative="توی دوره ایی ثبت نام نکردید">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {courses.map((course) => (
          <PCourseCard
            {...JSON.parse(JSON.stringify(course))}
            key={course._id}
            isAdmin={false}
          />
        ))}
      </div>
    </RenderList>
  );
}

function MyBlogs({ blogs }: { blogs: Blog[] }) {
  return (
    <RenderList items={blogs} alternative="وبلاگی رو شما لایک نکردین">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {blogs.map((blog) => (
          <PBlogCard
            {...JSON.parse(JSON.stringify(blog))}
            key={blog._id}
            isAdmin={false}
          />
        ))}
      </div>
    </RenderList>
  );
}
