"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "@/components/ui/toast";

import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

import {
  ArrowRight,

  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  Sparkles,
  Loader2,
  Users,
  Leaf,
  Heart,
} from "lucide-react";

type FormField = "name" | "email" | "password" | "confirmPassword";

type FormErrors = Partial<Record<FormField, string>>;

type SocialProvider = "google" | "facebook";

export default function Basic() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(
    null,
  );

  const [errors, setErrors] = useState<FormErrors>({});

  // Responsive input styling
  const inputClass =
    "h-11 w-full rounded-lg border border-[#DDDCD4] bg-transparent pl-11 pr-11 text-[13px] text-[#26382E] shadow-none outline-none transition-all placeholder:text-[#B1B3AE] focus-visible:border-[#234D3C] focus-visible:ring-1 focus-visible:ring-[#234D3C]/15 lg:h-10";

  const clearError = (field: FormField) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // SIGN UP
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const password = String(data.password || "");
    const confirmPassword = String(data.confirmPassword || "");

    const newErrors: FormErrors = {};

    if (name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Include at least one uppercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Include at least one number";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.add({
          type: "error",
          title: error.message || "Account could not be created!",
        });

        return;
      }

      toast.add({
        type: "success",
        title: "Account created successfully!",
      });

      setTimeout(() => {
        router.push("/");
      }, 1000);
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
    if (socialLoading) return;

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

      {/* MAIN SIGNUP BOX */}
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[#E5E0D7] bg-[#FDFCF9] shadow-[0_10px_50px_rgba(32,50,38,0.05)] lg:h-[calc(100svh-110px)] lg:min-h-0 lg:grid-cols-2">
        {/* LEFT IMAGE SECTION */}
        <div className="relative min-h-[220px] overflow-hidden bg-[#173C2E] sm:min-h-[300px] lg:min-h-0">
          <Image
            src="/signup/signupimage.png"
            alt="BookNook cozy library"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#102D22]/90 via-[#163B2D]/55 to-[#0D241B]/10" />

          {/* LEFT CONTENT */}
          <div className="relative z-10 flex h-full flex-col px-6 pt-6 sm:px-10 sm:pt-10 lg:px-10 lg:pt-8 xl:px-12">
            <Sparkles
              size={30}
              strokeWidth={1.3}
              className="mb-4 text-[#D6AD69]"
            />

            <h2 className="max-w-[360px] font-serif text-[34px] font-medium leading-[1.08] tracking-[-1px] text-[#F9F5E9] sm:text-[42px] lg:text-[44px]">
              Your story <span className="text-[#D0A76B]">belongs here.</span>
            </h2>

            <p className="mt-4 max-w-[295px] text-[13px] leading-[1.7] text-[#E2E8DE]">
              Join a community library where good books find new homes and great
              people.
            </p>

            {/* FEATURES */}
            <div className="mt-6 hidden lg:block">
              <div className="space-y-4">
                {/* FEATURE 1 */}
                <div className="flex items-center gap-4">
                  <Users
                    size={25}
                    strokeWidth={1.5}
                    className="shrink-0 text-[#D6AC5B]"
                  />

                  <p className="text-[13px] leading-5 text-[#F5F3EA]">
                    Borrow and lend
                    <br />
                    within your community
                  </p>
                </div>

                {/* FEATURE 2 */}
                <div className="flex items-center gap-4">
                  <Leaf
                    size={25}
                    strokeWidth={1.5}
                    className="shrink-0 text-[#D6AC5B]"
                  />

                  <p className="text-[13px] leading-5 text-[#F5F3EA]">
                    Discover new reads
                  </p>
                </div>

                {/* FEATURE 3 */}
                <div className="flex items-center gap-4">
                  <Heart
                    size={25}
                    strokeWidth={1.5}
                    className="shrink-0 text-[#D6AC5B]"
                  />

                  <p className="text-[13px] leading-5 text-[#F5F3EA]">
                    Share a love of books
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="flex flex-col justify-center px-5 py-6 sm:px-10 sm:py-8 lg:px-10 lg:py-3">
          {/* HEADING */}
          <div className="mb-5 lg:mb-3">
            <h1 className="font-serif text-[32px] font-semibold leading-tight tracking-[-1px] text-[#183A2D] sm:text-[38px] lg:text-[36px]">
              Create an account
            </h1>
          </div>

          {/* SIGNUP FORM */}
          <form
            onSubmit={onSubmit}
            noValidate
            className="flex w-full flex-col gap-3 lg:gap-2"
          >
            {/* FULL NAME */}
            <div className="flex flex-col gap-1.5 lg:gap-1">
              <Label
                htmlFor="name"
                className="text-[12px] font-medium text-[#333D35]"
              >
                Full name
              </Label>

              <div className="relative">
                <UserRound
                  size={17}
                  strokeWidth={1.5}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929991]"
                />

                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  minLength={3}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  className={inputClass}
                  onChange={() => clearError("name")}
                />
              </div>

              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-1.5 lg:gap-1">
              <Label
                htmlFor="email"
                className="text-[12px] font-medium text-[#333D35]"
              >
                Email address
              </Label>

              <div className="relative">
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

                {/* EMAIL ICON */}
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929991]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
              </div>

              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1.5 lg:gap-1">
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
                  minLength={8}
                  placeholder="Enter your password"
                  autoComplete="new-password"
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

              <div className="flex items-center justify-between gap-3">
                {errors.password ? (
                  <p className="text-xs text-red-500">{errors.password}</p>
                ) : (
                  <span />
                )}
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="flex flex-col gap-1.5 lg:gap-1">
              <Label
                htmlFor="confirmPassword"
                className="text-[12px] font-medium text-[#333D35]"
              >
                Confirm password
              </Label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  strokeWidth={1.5}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929991]"
                />

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  className={inputClass}
                  onChange={() => clearError("confirmPassword")}
                />

                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#89928B] hover:text-[#234D3C]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} strokeWidth={1.5} />
                  ) : (
                    <Eye size={17} strokeWidth={1.5} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-11 w-full rounded-lg bg-[#234D3C] text-[13px] font-medium text-white transition-all duration-300 hover:bg-[#173D2E] active:scale-[0.99] lg:mt-1 lg:h-10"
            >
              {isLoading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={17} strokeWidth={1.6} />
                </>
              )}
            </Button>
          </form>

          {/* DIVIDER */}
          <div className="my-5 flex items-center gap-4 lg:my-3">
            <div className="h-px flex-1 bg-[#E5E1D9]" />

            <span className="whitespace-nowrap text-[12px] text-[#96958E]">
              or continue with
            </span>

            <div className="h-px flex-1 bg-[#E5E1D9]" />
          </div>

          {/* SOCIAL LOGIN */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-2">
            {/* GOOGLE */}
            <Button
              type="button"
              variant="outline"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin("google")}
              className="h-11 w-full gap-2 rounded-lg border-[#C9D1C7] bg-transparent px-2 text-[12px] font-medium text-[#26382E] shadow-none hover:border-[#234D3C] hover:bg-[#F2F5F0] lg:h-10"
            >
              {socialLoading === "google" ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <FcGoogle size={19} />
              )}
              Continue with Google
            </Button>

            {/* FACEBOOK */}
            <Button
              type="button"
              variant="outline"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin("facebook")}
              className="h-11 w-full gap-2 rounded-lg border-[#C9D1C7] bg-transparent px-2 text-[12px] font-medium text-[#26382E] shadow-none hover:border-[#234D3C] hover:bg-[#F2F5F0] lg:h-10"
            >
              {socialLoading === "facebook" ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <FaFacebookF size={17} />
              )}
              Continue with Facebook
            </Button>
          </div>

          {/* SIGN IN */}
          <p className="mt-6 text-center text-[13px] text-[#6D716B] lg:mt-3">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-[#A77B3C] underline-offset-4 hover:text-[#234D3C] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
