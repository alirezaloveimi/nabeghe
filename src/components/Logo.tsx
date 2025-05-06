import Link from "next/link";
import { HiLightBulb } from "react-icons/hi";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-primary">
      <HiLightBulb className="size-6" />

      <div className="flex flex-col items-start">
        <span className="font-bold text-muted text-sm">آکــــادمـــی</span>
        <span className="font-black text-xl">نـــابــــغه</span>
      </div>
    </Link>
  );
}
