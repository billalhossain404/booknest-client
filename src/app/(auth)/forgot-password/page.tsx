"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole, Loader2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "@/components/ui/toast";
import { requestPasswordReset } from "@/lib/auth-client";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const email = String(
      new FormData(event.currentTarget).get("email") || "",
    ).trim();
    setIsLoading(true);

    try {
      const { error } = await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        throw new Error(error.message || "Password reset request failed");
      }

      toast.add({
        type: "success",
        title: "If an account exists, a reset link is on its way.",
      });
    } catch {
      toast.add({
        type: "error",
        title: "We couldn't send the reset link. Please try again.",
      });
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
          Reset your password
        </h1>
        <p className="mt-3 text-[13px] leading-7 text-[#777872]">
          Enter your email and we&apos;ll send you a secure link to create a new password.
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[12px] font-medium text-[#333D35]">
              Email address
            </Label>
            <div className="relative">
              <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929991]" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
                className="h-11 rounded-lg border-[#DDDCD4] bg-transparent pl-11 text-[13px] text-[#26382E] shadow-none focus-visible:border-[#234D3C] focus-visible:ring-[#234D3C]/15"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-lg bg-[#234D3C] text-[13px] font-medium text-white hover:bg-[#173D2E]"
          >
            {isLoading ? <Loader2 size={17} className="animate-spin" /> : <>Send reset link <ArrowRight size={17} /></>}
          </Button>
        </form>

        <Link href="/sign-up" className="mt-7 flex items-center justify-center gap-2 text-[12px] text-[#8A8E86] hover:text-[#234D3C]">
          <ArrowLeft size={15} />
          Back to sign up
        </Link>
      </section>
    </main>
  );
}
