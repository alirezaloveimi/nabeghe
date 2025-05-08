import BulletLabel from "@/components/BulletLabel";
import DataTable from "@/components/DataTable";
import { commentcolumns } from "@/data";
import { getAllComments } from "@/util/comment";
import { getUser } from "@/util/user";
import { redirect } from "next/navigation";

export type CommentData = {
  id: number;
  name: string;
  entity: string;
  accept: string;
  action: { adminId: string; comment: CommentT };
};

export default async function PAdminCommentsPage() {
  const [admin, comments] = await Promise.all([getUser(), getAllComments()]);

  if (!admin) {
    redirect("/register-login");
  }

  const data: CommentData[] = comments.map((comment, index) => ({
    id: index + 1,
    name: comment.user.fullname,
    entity: `${comment.entityType}-${comment.entityId.title}`,
    accept: comment.isAccept ? "تایید شده" : "تایید نشده",
    action: { adminId: admin._id, comment },
  }));

  return (
    <div className="space-y-8">
      <BulletLabel label="مدیریت نظرات" />
      <DataTable alternative="کامنتی یافت نشد" data={data} columns={commentcolumns} />
    </div>
  );
}
