import { connectDB } from "@/lib/config/db";
import Blog from "@/lib/models/Blog";
import SectionLabel from "@/components/SectionLabel";
import RenderList from "@/components/RenderList";
import BlogCard from "@/components/BlogCard";

const getBlogs = async (): Promise<Blog[]> => {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return blogs;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="space-y-12">
      <SectionLabel
        text="برنامه نویسی که مقاله نخونه کنسله ✌😁"
        title="مقالات آموزشی"
      />

      <div>
        <RenderList items={blogs} alternative="دوره ایی یافت نشد">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </RenderList>
      </div>
    </div>
  );
}
