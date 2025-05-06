import Image from "next/image";

import AsideLink from "./AsideLinks";
import LogoutBtn from "./LogoutBtn";

import { getUser } from "@/util/user";
import { asideLinks } from "@/data";
import { redirect } from "next/navigation";

export default async function Aside() {
  const user = await getUser();

  if (!user) {
    redirect("/register-login");
  }

  const links = asideLinks[user.role as User["role"]] || [];

  return (
    <aside className="lg:col-span-4 xl:col-span-3 md:sticky md:top-24">
      <div className="flex-align-center gap-x-3 mb-5">
        <Image
          priority={true}
          src={user?.image?.url || "/images/user-no-image.png"}
          alt="user-image"
          width={40}
          height={40}
          className="rounded-full object-cover flex-shrink-0"
        />

        <div className="flex flex-col space-y-1">
          <span className="text-xs text-muted">خوش آمدید</span>
          <span className="font-bold text-sm text-foreground">
            {user?.fullname} ({user?.role === "ADMIN" ? "مدیر" : "کاربر"})
          </span>
        </div>
      </div>

      <div className="bg-secondary rounded-2xl p-5 space-y-3">
        <ul className="space-y-3">
          {links.map((item) => (
            <AsideLink key={item.id} {...item} />
          ))}
        </ul>

        <LogoutBtn />
      </div>
    </aside>
  );
}
