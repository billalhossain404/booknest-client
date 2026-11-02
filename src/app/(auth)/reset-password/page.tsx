import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense
  fallback={
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF9F5]">
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-[#EAE6DC] bg-white px-12 py-10 shadow-sm">

        <Loader2 className="h-10 w-10 animate-spin text-[#234D3C]" />

        <div className="text-center">
          <h2 className="text-base font-semibold text-[#234D3C]">
            BookNest
          </h2>
          <p className="mt-1 text-sm text-[#8A8E86]">
            Preparing your experience...
          </p>
        </div>

        <div className="h-1 w-32 overflow-hidden rounded-full bg-[#EAE6DC]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#234D3C]" />
        </div>

      </div>
    </div>
  }
>
  <ResetPasswordForm />
</Suspense>
  );
}
