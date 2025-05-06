import BulletLabel from "@/components/BulletLabel";
import AddNewBlogForm from "@/components/form/AddNewBlogForm";

export default function PAdminAddBlogPage() {
  return (
    <div className="space-y-8">
      <BulletLabel label="اضافه کردن وبلاگ جدید" />
      <AddNewBlogForm />
    </div>
  );
}
