import BulletLabel from "@/components/BulletLabel";
import PBlogCard from "@/components/PBlogCard";
import RenderList from "@/components/RenderList";
import { connectDB } from "@/lib/config/db";
import Blog from "@/lib/models/Blog";
import { getUser } from "@/util/user";
import { redirect } from "next/navigation";

const getLikedBlogs = async (id: string) => {
  try {
    await connectDB();
    const blogs = await Blog.find({ likes: id });
    return blogs;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function PUserLikedBlogsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/register-login");
  }

  const likedBlogs = await getLikedBlogs(user._id);

  return (
    <div className="space-y-8">
      <BulletLabel label="وبلاگ های مورد علاقه من" />
      <LikedBlogsList blogs={likedBlogs} />
    </div>
  );
}

function LikedBlogsList({ blogs }: { blogs: Blog[] }) {
  return (
    <RenderList items={blogs} alternative="شما در دوره ایی ثبت نام نکردید">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <PBlogCard
            isAdmin={false}
            key={blog._id}
            {...JSON.parse(JSON.stringify(blog))}
          />
        ))}
      </div>
    </RenderList>
  );
}
