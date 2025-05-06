import BulletLabel from "@/components/BulletLabel";
import FilterUsers from "@/components/FilterUsers";
import Spinner from "@/components/Spinner";
import UserTable from "@/components/UserTable";
import { Suspense } from "react";

export default async function PAdminUsersPage(props: {
  searchParams: Promise<{ s?: string }>;
}) {
  const searchParams = await props.searchParams;
  const s = searchParams?.s || "";

  return (
    <div className="space-y-8">
      <BulletLabel label="لیست کاربران وبسایت" />

      <div className="space-y-8">
        <FilterUsers />

        <Suspense
          key={s}
          fallback={
            <div className="grid-center pt-8">
              <Spinner width={50} height={50} />
            </div>
          }
        >
          <UserTable search={s} />
        </Suspense>
      </div>
    </div>
  );
}
