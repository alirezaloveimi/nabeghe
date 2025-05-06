import Alert from "@/components/Alert";
import BulletLabel from "@/components/BulletLabel";
import RechargWalletForm from "@/components/form/RechargWalletForm";
import { priceWithDots } from "@/util/price";
import { getUser } from "@/util/user";
import { redirect } from "next/navigation";
import { FaInfo } from "react-icons/fa";

export default async function PUserWalletPage() {
  const user = await getUser();

  if (!user) {
    redirect("/register-login");
  }

  return (
    <div className="space-y-8">
      <BulletLabel label="کیف پول من" />

      <div className="space-y-6">
        <h1 className="font-bold text-xl md:text-2xl">
          موجودی کیف پول من : {priceWithDots(user.wallet)}
        </h1>

        <Alert colorIcon="#f00" icon={<FaInfo />}>
          با سلام با توجه به اینکه این وبسایت یه سایت تمرینی میباشد و با هدف
          یادگیری ساخته شده به درگاه پرداخت متصل نشده و برای خرید دوره میتوانید
          به هر مقدار کیف پول خود را شارژ کنید
        </Alert>

        <div className="max-w-md">
          <RechargWalletForm id={`${user._id}`} />
        </div>
      </div>
    </div>
  );
}
