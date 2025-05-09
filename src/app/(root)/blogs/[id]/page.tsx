import { connectDB } from "@/lib/config/db";
import Blog from "@/lib/models/Blog";
import Image from "next/image";
import { redirect } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { decodeHTMLEntities, highlightCode } from "@/util/form";
import AddComment from "@/components/AddComment";
import RenderList from "@/components/RenderList";
import { getCommentById } from "@/util/comment";
import Comment from "@/components/Comment";
import { getUser } from "@/util/user";
import { createComment } from "@/actions/comment";
import BulletLabel from "@/components/BulletLabel";

import LikeBlogBtn from "@/components/LikeBlogBtn";

const getBlogById = async (id: string): Promise<Blog | undefined> => {
  try {
    await connectDB();
    const blog = await Blog.findById(id);
    return blog;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();

  const [blog, comments] = await Promise.all([
    getBlogById(id),
    getCommentById(id, "Blog"),
  ]);

  if (!blog) {
    redirect("/not-found");
  }

  let html = blog.html;
  html = html.replace(
    /<pre.*?><code.*?>([\s\S]*?)<\/code><\/pre>/g,
    (_, code) => highlightCode(decodeHTMLEntities(code.trim()))
  );

  const isLike = blog.likes.some(
    (like) => like._id.toString() === user?._id.toString()
  );

  return (
    <div className="space-y-14">
      <div className="flex flex-wrap items-start md:flex-nowrap gap-5">
        <div className="w-full lg:w-8/12">
          <div className="relative">
            <div className="relative z-10">
              <Image
                alt="blog-cover"
                src={blog.cover.url}
                className="size-full rounded-3xl object-cover"
                priority={true}
                width={500}
                height={500}
              />
            </div>
            <div className="-mt-12 pt-12"></div>
          </div>

          <div className="bg-gradient-to-b from-background to-secondary rounded-b-3xl space-y-2 p-5 mx-5">
            <h3 className="font-bold text-xl text-foreground">{blog.title}</h3>

            <p className="text-sm text-muted line-clamp-3 sm:line-clamp-3">
              {blog.description}
            </p>
          </div>

          <div className="space-y-10 [&>div]:space-y-5 py-5">
            <div>
              <div
                className="prose prose-lg dark:prose-invert max-w-none [&>img]:rounded-3xl [&>img]:shadow [&>img]:!cursor-default"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(html),
                }}
              />
            </div>

            <div>
              <AddComment
                entityType="Blog"
                user={JSON.parse(JSON.stringify(user))}
                id={`${blog._id}`}
                action={createComment}
              />

              <RenderList alternative="کامنتی ثبت نشده" items={comments}>
                {comments.map((comment) => (
                  <Comment key={comment._id} comment={comment} />
                ))}
              </RenderList>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-4/12 lg:sticky lg:top-24 space-y-8">
          <div className="bg-gradient-to-b from-secondary to-background rounded-2xl px-5 pb-5 space-y-3">
            <div className="bg-background rounded-b-3xl p-5 mb-5 space-y-2">
              <BulletLabel label={`نویسنده مقاله : ${blog.author}`} />

              <p className="text-sm text-muted">
                تاریخ انتشار مقاله :
                {new Date(blog.createdAt).toLocaleDateString("fa-IR")}
              </p>
            </div>

            <LikeBlogBtn
              isLike={isLike}
              likes={blog.likes.length}
              blogId={`${id}`}
              userId={user ? `${user._id}` : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
