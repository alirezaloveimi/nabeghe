import BulletLabel from "@/components/BulletLabel";
import AddNewTeacherForm from "@/components/form/AddNewTeacherForm";

export default function PAdminAddTeacher() {
  return (
    <div className="space-y-8">
      <BulletLabel label="فرم افزودن استاد جدید" />
      <AddNewTeacherForm />
    </div>
  );
}
