"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "@/components/ui/toast";
import { resetPassword } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");

    if (!token) {
      setError("This password reset link is invalid or has expired.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { error: resetError } = await resetPassword({
        newPassword: password,
        token,
      });

      if (resetError) {
        throw new Error(resetError.message || "Password reset failed");
      }

      toast.add({
        type: "success",
        title: "Password reset successfully!",
      });

      setTimeout(() => {
        router.replace("/");
      }, 1000);
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "We couldn't reset your password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F6F1] px-4 py-6">
      <Toaster />
      <section className="w-full max-w-md rounded-2xl border border-[#E5E0D7] bg-[#FDFCF9] p-6 shadow-[0_10px_50px_rgba(32,50,38,0.06)] sm:p-10">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF0EA] text-[#234D3C]">
          <LockKeyhole size={21} strokeWidth={1.6} />
        </div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[2.5px] text-[#B58B4D]">
          Account recovery
        </p>
        <h1 className="font-serif text-[34px] font-semibold leading-tight tracking-[-1px] text-[#183A2D]">
          Create a new password
        </h1>
        <p className="mt-3 text-[13px] leading-7 text-[#777872]">
          Choose a secure password with at least 8 characters.
        </p>

        <form onSubmit={handleResetPassword} className="mt-7 space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-[12px] font-medium text-[#333D35]"
            >
              New password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                className="h-11 rounded-lg border-[#DDDCD4] bg-transparent pr-11 text-[13px] text-[#26382E] shadow-none focus-visible:border-[#234D3C] focus-visible:ring-[#234D3C]/15"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#89928B] hover:text-[#234D3C]"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-lg bg-[#234D3C] text-[13px] font-medium text-white hover:bg-[#173D2E]"
          >
            {isLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              "Reset password"
            )}
          </Button>
        </form>

        <Link
          href="/sign-in"
          className="mt-7 flex items-center justify-center gap-2 text-[12px] text-[#8A8E86] hover:text-[#234D3C]"
        >
          <ArrowLeft size={15} />
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
