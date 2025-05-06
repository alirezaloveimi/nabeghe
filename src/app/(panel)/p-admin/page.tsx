import { connectDB } from "@/lib/config/db";
import Course from "@/lib/models/Course";
import User from "@/lib/models/User";
import Comment from "@/lib/models/Comment";
import "@/lib/models/Teacher";
import "@/lib/models/Category";

import BulletLabel from "@/components/BulletLabel";
import RenderList from "@/components/RenderList";
import PCourseCard from "@/components/PCourseCard";
import Blog from "@/lib/models/Blog";
import PBlogCard from "@/components/PBlogCard";

type StatsCardProps = {
  title: string;
  value: number;
};

const getCourses = async (): Promise<{
  lastCourses: Course[];
  totalCourses: number;
}> => {
  try {
    await connectDB();

    const [totalCourses, lastCourses] = await Promise.all([
      Course.countDocuments(),
      Course.find({})
        .limit(3)
        .sort({ createdAt: -1 })
        .populate("teacher")
        .populate("category"),
    ]);

    return { totalCourses, lastCourses };
  } catch (e) {
    console.log(e);
    return { totalCourses: 0, lastCourses: [] };
  }
};

const getUsers = async (): Promise<{
  lastUsers: User[];
  totalUsers: number;
}> => {
  try {
    await connectDB();

    const [totalUsers, lastUsers] = await Promise.all([
      User.find({ role: "USER" }),
      User.find({ role: "USER" }).sort({ createdAt: -1 }).limit(3),
    ]);

    console.log(totalUsers);

    return { totalUsers: totalUsers.length, lastUsers };
  } catch (e) {
    console.log(e);
    return { totalUsers: 0, lastUsers: [] };
  }
};

const getComments = async (): Promise<{
  totalComments: number;
  lastComments: CommentT[];
}> => {
  try {
    await connectDB();

    const [totalComments, lastComments] = await Promise.all([
      Comment.find({
        parentId: undefined,
      }),
      Comment.find({
        parentId: undefined,
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("user", "fullname image role")
        .populate("entityId"),
    ]);

    return { totalComments: totalComments.length, lastComments };
  } catch (e) {
    console.log(e);
    return { lastComments: [], totalComments: 0 };
  }
};

const getBlogs = async (): Promise<{
  totalBlogs: number;
  lastBlogs: Blog[];
}> => {
  try {
    await connectDB();

    const [totalBlogs, lastBlogs] = await Promise.all([
      Blog.countDocuments(),
      Blog.find({}).sort({ createdAt: -1 }).limit(3),
    ]);

    return { totalBlogs: totalBlogs, lastBlogs };
  } catch (e) {
    console.log(e);
    return { lastBlogs: [], totalBlogs: 0 };
  }
};

export default async function PAdminPage() {
  const [
    { lastCourses, totalCourses },
    { totalUsers },
    { lastComments, totalComments },
    { lastBlogs, totalBlogs },
  ] = await Promise.all([getCourses(), getUsers(), getComments(), getBlogs()]);

  return (
    <div className="space-y-8 [&>div]:space-y-8">
      <div>
        <BulletLabel label="پنل مدیریت" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="تعداد کاربران" value={totalUsers} />
          <StatsCard title="تعداد دوره‌ها" value={totalCourses} />
          <StatsCard title="تعداد وبلاگ ها" value={totalBlogs} />
          <StatsCard title="تعداد نظرات ارسال‌شده" value={totalComments} />
        </div>
      </div>

      <div>
        <BulletLabel label="اخرین کامنت ها" />
        <LastestComments comments={lastComments} />
      </div>

      <div>
        <BulletLabel label="اخرین دوره ها" />
        <LastestCourses courses={lastCourses} />
      </div>

      <div>
        <BulletLabel label="اخرین وبلاگ ها" />
        <LastestBlogs blogs={lastBlogs} />
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

function LastestComments({ comments }: { comments: CommentT[] }) {
  return (
    <RenderList items={comments} alternative="کامنتی در وبسایت ثبت نشده">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
            <h2 className="text-lg font-medium">{comment.entityId.title}</h2>
            <p className="text-gray-700 mt-1">{comment.text}</p>
          </div>
        ))}
      </div>
    </RenderList>
  );
}

function LastestCourses({ courses }: { courses: Course[] }) {
  return (
    <RenderList items={courses} alternative="دوره ایی در وبسایت ثبت نشده">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {courses.map((course) => (
          <PCourseCard
            {...JSON.parse(JSON.stringify(course))}
            key={course._id}
          />
        ))}
      </div>
    </RenderList>
  );
}

function LastestBlogs({ blogs }: { blogs: Blog[] }) {
  return (
    <RenderList items={blogs} alternative="وبلاگی در وبسایت ثبت نشده">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {blogs.map((blog) => (
          <PBlogCard {...JSON.parse(JSON.stringify(blog))} key={blog._id} />
        ))}
      </div>
    </RenderList>
  );
}
