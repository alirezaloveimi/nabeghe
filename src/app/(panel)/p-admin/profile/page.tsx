import BulletLabel from "@/components/BulletLabel";
import EditInfo from "@/components/form/EditInfo";
import Profile from "@/components/Profile";

import { redirect } from "next/navigation";
import { getUser } from "@/util/user";

export default async function PAdminProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/register-login");
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Profile
          model="USER"
          userId={`${user._id}`}
          defaultImg={user.image?.url || "/images/user-no-image.png"}
        />
        <BulletLabel label="عکس پروفایل" />
      </div>

      <div className="space-y-4">
        <BulletLabel label="ویرایش حساب کاربری" />
        <EditInfo fullname={user.fullname} phone={user.phone} />
      </div>
    </div>
  );
}
