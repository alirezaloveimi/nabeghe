import BulletLabel from "@/components/BulletLabel";
import EditBlogForm from "@/components/form/EditBlogForm";
import { connectDB } from "@/lib/config/db";
import Blog from "@/lib/models/Blog";
import { redirect } from "next/navigation";
import React from "react";

const getBlogById = async (id: string): Promise<Blog | undefined> => {
  try {
    await connectDB();
    const blog = await Blog.findOne({ _id: id });
    return blog;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export default async function PAdminEditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    redirect("/not-found");
  }

  return (
    <div className="space-y-8">
      <BulletLabel label="آپدیت اطلاعات وبلاگ" />
      <EditBlogForm {...JSON.parse(JSON.stringify(blog))} />
    </div>
  );
}
