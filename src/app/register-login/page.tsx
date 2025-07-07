import Alert from "@/components/Alert";
import AuthStepForm from "@/components/auth/AuthStepForm";
import Logo from "@/components/Logo";
import AuthProvider from "@/context/AuthProvider";

import { IoWarning } from "react-icons/io5";

export default function RegisterLoginPage() {
  return (
    <div className="space-y-16">
      <Alert icon={<IoWarning />} colorIcon="#ffcc00">
        به اطلاع می‌رسانیم که به دلیل محدودیت‌های اعمال‌شده از سوی سرویس‌دهنده
        پیامکی (فراز اس‌ام‌اس)، امکان ارسال پیامک از سرورهای خارج از ایران
        (مانند Vercel) وجود ندارد. به همین دلیل، این قابلیت موقتاً از وب‌سایت
        حذف شده است.
      </Alert>

      <div className="w-full max-w-sm mx-auto space-y-5">
        <div className="bg-gradient-to-b from-secondary to-background rounded-3xl space-y-5 px-5 pb-5">
          <div className="bg-background rounded-b-3xl space-y-2 p-5">
            <Logo />
          </div>

          <AuthProvider>
            <AuthStepForm />
          </AuthProvider>

          <div className="bg-secondary rounded-xl space-y-5 p-5">
            <p className="font-bold text-xs text-center text-muted">
              ورود شما به معنای پذیرش
              <span className="text-foreground"> شرایط </span> و
              <span className="text-foreground"> قوانین حریم خصوصی </span>
              است.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
