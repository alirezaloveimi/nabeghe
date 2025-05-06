import BulletLabel from "@/components/BulletLabel";
import AddNewCouresForm from "@/components/form/AddNewCouresForm";

export default function PAdminAddCoures() {
  return (
    <div className="space-y-8">
      <BulletLabel label="اضافه کردن دوره جدید" />
      <AddNewCouresForm />
    </div>
  );
}
