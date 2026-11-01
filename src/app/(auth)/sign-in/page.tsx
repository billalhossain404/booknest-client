"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "@/components/ui/toast";

import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  KeyRound,
  Sparkles,
  Loader2,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

type FormField = "email" | "password";
type FormErrors = Partial<Record<FormField, string>>;
type SocialProvider = "google" | "facebook";

export default function Basic() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(
    null,
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const inputClass =
    "h-11 w-full rounded-lg border border-[#DDDCD4] bg-transparent pl-11 pr-11 text-[13px] text-[#26382E] shadow-none outline-none transition-all placeholder:text-[#B1B3AE] focus-visible:border-[#234D3C] focus-visible:ring-1 focus-visible:ring-[#234D3C]/15";

  const clearError = (field: FormField) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // EMAIL LOGIN
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || socialLoading) return;

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const newErrors: FormErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Please enter your password";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const { error } = await signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.add({
          type: "error",
          title: error.message || "Invalid email or password.",
        });
        return;
      }

      toast.add({ type: "success", title: "Logged in successfully!" });
      window.location.href = "/";
    } catch {
      toast.add({
        type: "error",
        title: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // SOCIAL LOGIN
  const handleSocialLogin = async (provider: SocialProvider) => {
    if (socialLoading || isLoading) return;
    setSocialLoading(provider);
    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: "/",
      });
      if (error) {
        toast.add({
          type: "error",
          title: error.message || `${provider} sign-in failed`,
        });
      }
    } catch {
      toast.add({
        type: "error",
        title: "Social sign-in failed. Try again.",
      });
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F6F1] px-3 py-3 sm:px-6 lg:h-[calc(100svh-94px)] lg:min-h-0 lg:px-8 lg:py-2">
      <Toaster />

      {/* MAIN LOGIN BOX */}
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[#E5E0D7] bg-[#FDFCF9] shadow-[0_10px_50px_rgba(32,50,38,0.05)] lg:h-[calc(100svh-110px)] lg:min-h-0 lg:grid-cols-2">
        {/* LEFT IMAGE SECTION */}
        <div className="relative min-h-[220px] overflow-hidden bg-[#173C2E] sm:min-h-[300px] lg:min-h-0">
          <Image
            src="/signin/signinimage.png"
            alt="BookNest cozy library"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#102D22]/90 via-[#163B2D]/55 to-[#0D241B]/10" />

          <div className="relative z-10 flex h-full flex-col px-8 pt-8 sm:px-12 sm:pt-12 lg:px-14 lg:pt-16">
            <Sparkles
              size={30}
              strokeWidth={1.3}
              className="mb-6 text-[#D6AD69]"
            />
            <h2 className="max-w-[360px] font-serif text-[38px] font-medium leading-[1.08] tracking-[-1px] text-[#F9F5E9] sm:text-[46px] lg:text-[52px]">
              A new chapter awaits.
            </h2>
            <p className="mt-5 max-w-[295px] text-[14px] leading-[1.8] text-[#E2E8DE]">
              BookNook is a community of book lovers, where every story finds a
              reader and every book finds a new home.
            </p>
            <div className="mt-7 hidden items-center gap-3 lg:flex">
              <div className="h-px w-9 bg-[#D6AD69]" />
              <span className="text-[11px] font-medium uppercase tracking-[2.5px] text-[#E9DECA]">
                Read. Share. Discover.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-5">
          <div className="mb-7 lg:mb-6">
            <h1 className="font-serif text-[36px] font-semibold leading-tight tracking-[-1px] text-[#183A2D] sm:text-[42px]">
              Welcome Back
            </h1>
            <p className="mt-2 max-w-[340px] text-[15px] leading-[1.8] text-[#676866]">
              Log in to continue your reading journey with BookNest.
            </p>
          </div>

          {/* EMAIL AND PASSWORD */}
          <form
            onSubmit={onSubmit}
            noValidate
            className="flex w-full flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-[12px] font-medium text-[#333D35]"
              >
                Email address
              </Label>
              <div className="relative">
                <Mail
                  size={17}
                  strokeWidth={1.5}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929991]"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  className={inputClass}
                  onChange={() => clearError("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="password"
                className="text-[12px] font-medium text-[#333D35]"
              >
                Password
              </Label>
              <div className="relative">
                <LockKeyhole
                  size={17}
                  strokeWidth={1.5}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929991]"
                />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  className={inputClass}
                  onChange={() => clearError("password")}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#89928B] hover:text-[#234D3C]"
                >
                  {showPassword ? (
                    <EyeOff size={17} strokeWidth={1.5} />
                  ) : (
                    <Eye size={17} strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}

              {/* NEW: FORGOT PASSWORD BUTTON */}
              <div className="mt-1 flex justify-end">
                <Link
                  href="/forgot-password"
                  className="group inline-flex items-center gap-1.5 rounded-lg border border-[#E9E4D9] bg-[#FBF8F0] px-3 py-2 text-[12px] font-medium text-[#956A30] transition-all duration-200 hover:border-[#D6AD69] hover:bg-[#F6EFDf] hover:text-[#234D3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234D3C]/30"
                >
                  <KeyRound size={14} strokeWidth={1.8} />
                  Forgot password?
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || socialLoading !== null}
              className="mt-2 h-11 w-full rounded-lg bg-[#234D3C] text-[13px] font-medium text-white transition-all duration-300 hover:bg-[#173D2E] active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Log in
                  <ArrowRight size={17} strokeWidth={1.6} />
                </>
              )}
            </Button>
          </form>

          {/* DIVIDER */}
          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E5E1D9]" />
            <span className="whitespace-nowrap text-[12px] text-[#96958E]">
              or continue with
            </span>
            <div className="h-px flex-1 bg-[#E5E1D9]" />
          </div>

          {/* SOCIAL LOGIN */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading || socialLoading !== null}
              onClick={() => handleSocialLogin("google")}
              className="h-11 w-full gap-2 rounded-lg border-[#C9D1C7] bg-transparent px-2 text-[12px] font-medium text-[#26382E] shadow-none hover:border-[#234D3C] hover:bg-[#F2F5F0]"
            >
              {socialLoading === "google" ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <FcGoogle size={19} />
              )}
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isLoading || socialLoading !== null}
              onClick={() => handleSocialLogin("facebook")}
              className="h-11 w-full gap-2 rounded-lg border-[#C9D1C7] bg-transparent px-2 text-[12px] font-medium text-[#26382E] shadow-none hover:border-[#234D3C] hover:bg-[#F2F5F0]"
            >
              {socialLoading === "facebook" ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <FaFacebookF size={17} />
              )}
              Continue with Facebook
            </Button>
          </div>

          {/* SIGN UP LINK */}
          <p className="mt-6 text-center text-[13px] text-[#6D716B]">
            New to BookNest?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-[#A77B3C] underline-offset-4 hover:text-[#234D3C] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
