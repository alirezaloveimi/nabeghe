import AuthStepForm from "@/components/auth/AuthStepForm";
import Logo from "@/components/Logo";
import AuthProvider from "@/context/AuthProvider";

export default function RegisterLoginPage() {
  return (
    <div className="h-screen flex-center">
      <div className="w-full max-w-sm space-y-5">
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
