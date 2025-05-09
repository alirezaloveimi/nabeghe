import Button from "@/components/Button";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="h-screen grid-center space-y-3">
      <Image
        quality={100}
        width={350}
        height={350}
        src="/images/not-found.png"
        alt="not-found"
        className="mx-auto"
      />

      <h2 className="text-2xl text-center">چنین صفحه ایی پیدا نشد</h2>
      <p className="text-sm text-muted">
        با عرض پوزش از شما چنین صفحه ایی در سایت وجود ندارد یا این صفحه از سایت
        پاک شده
      </p>

      <div className="flex justify-center">
        <Button width={200} isLink href="/">
          بازگشت به خانه
        </Button>
      </div>
    </div>
  );
}
