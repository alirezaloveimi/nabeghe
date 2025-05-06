import BulletLabel from "@/components/BulletLabel";
import Button from "@/components/Button";
import RenderList from "@/components/RenderList";
import { connectDB } from "@/lib/config/db";
import Blog from "@/lib/models/Blog";
import Image from "next/image";
import Link from "next/link";
import { IoEye, IoPencilSharp, IoTrash } from "react-icons/io5";

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

export default function PAdminBlogsPage() {
  return (
    <div className="space-y-8">
      <div className="flex-between-center">
        <BulletLabel label="وبلاگ های وبسایت" />
        <Button width={180} isLink href="/p-admin/blogs/add">
          اضافه کردن وبلاگ جدید
        </Button>
      </div>

      <BlogList />
    </div>
  );
}

async function BlogList() {
  const blogs = await getBlogs();

  return (
    <RenderList items={blogs} alternative="مقاله ایی در وبسایت وجود ندارد">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} {...JSON.parse(JSON.stringify(blog))} />
        ))}
      </div>
    </RenderList>
  );
}

function BlogCard({ author, cover, description, title, _id }: Blog) {
  return (
    <div className="bg-secondary rounded-xl overflow-hidden">
      <div className="relative w-full h-48">
        <Image src={cover.url} alt="blog-image" fill />
      </div>
      <div className="p-4 space-y-3">
        <div className="text-xs">✍️ نویسنده: {author}</div>
        <h3 className="text-lg line-clamp-2">{title}</h3>
        <p className="text-muted text-sm line-clamp-2">{description}</p>

        <div className="flex-align-center gap-x-3 pt-4">
          <Link
            href={`/p-admin/blogs/${_id}`}
            className="p-2 rounded-md border border-border hover:bg-input transition"
          >
            <IoPencilSharp className="text-foreground text-lg" />
          </Link>

          <button
            // onClick={onDelete}
            className="p-2 rounded-md border border-border hover:bg-input transition"
          >
            <IoTrash className="text-red-600 text-lg" />
          </button>

          <Link
            href={`/blogs/${_id}`}
            className="p-2 rounded-md border border-border hover:bg-input transition"
          >
            <IoEye className="text-foreground text-lg" />
          </Link>
        </div>
      </div>
    </div>
  );
}
