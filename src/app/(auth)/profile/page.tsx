"use client";

import { useState, type FormEvent } from "react";
import { useSession, updateUser } from "@/lib/auth-client";
import { Loader2, UserRound, Mail, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { toast } from "@/components/ui/toast";

export default function ProfilePage() {
  const { data: session, isPending, refetch } = useSession();
  const [isSaving, setIsSaving] = useState(false);

  // Update Profile
  const handleUpdateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();

    if (name.length < 3) {
      toast.add({
        type: "error",
        description: "Name must be at least 3 characters.",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await updateUser({ name });

      if (error) {
       toast.add({
  type: "error",
  title: "Update Failed!",
  description: "Failed to update profile.",
  priority: "high",
});
        return;
      }

      await refetch();

      toast.add({
  type: "success",
  title: "Success!",
  description: "Profile updated successfully!",
});
    } catch (error) {
      console.error("Profile update error:", error);

      toast.add({
        type: "error",
        description: "Something went wrong. Please try again.",
        priority: "high",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Loading State
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#234D3C]" />
      </div>
    );
  }

  // Authentication Check
  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5]">
        <p className="text-lg font-semibold text-[#234D3C]">
          Please login first.
        </p>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#FAF9F5] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Profile Edit Card */}
        <Card className="overflow-hidden rounded-2xl border-[#EAE6DC] bg-white shadow-[0_10px_40px_rgba(35,77,60,0.05)]">
          {/* Profile Header */}
          <CardHeader className="px-6 pb-2 sm:px-8">
            <div className="relative z-10 mb-3">
              <Avatar className="h-28 w-28 rounded-full border-4 border-white shadow-md">
                <AvatarImage
                  src={user.image || "/images/default-avatar.png"}
                  alt={user.name || "Profile"}
                  className="object-cover"
                />

                <AvatarFallback className="rounded-xl bg-[#EAF1EC] text-3xl font-bold text-[#234D3C]">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <CardTitle className="text-xl font-bold text-[#234D3C]">
              Personal Information
            </CardTitle>

            <CardDescription className="text-sm text-gray-500">
              Edit your profile details below.
            </CardDescription>
          </CardHeader>

          {/* Form Content */}
          <CardContent className="px-6 pb-8 sm:px-8">
            <form
              key={`${user.id}-${user.name}`}
              onSubmit={handleUpdateUser}
              className="mt-5 space-y-6"
            >
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold text-[#34483B]">
                  Full Name
                </Label>

                <div className="relative">
                  <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <Input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={user.name || ""}
                    placeholder="Enter your name"
                    required
                    minLength={3}
                    autoComplete="name"
                    className="h-12 rounded-xl border-[#E5E0D5] pl-11 focus-visible:ring-[#234D3C]"
                  />
                </div>

                <p className="text-xs text-gray-400">
                  Your name must contain at least 3 characters.
                </p>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-[#34483B]">
                  Email Address
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    readOnly
                    className="h-12 rounded-xl border-[#E5E0D5] bg-[#F5F5F1] pl-11 text-gray-500"
                  />
                </div>

                <p className="text-xs text-gray-400">
                  Your registered email address cannot be changed here.
                </p>
              </div>

              <Separator className="bg-[#EAE6DC]" />

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="h-12 w-full rounded-xl bg-[#234D3C] px-8 font-semibold text-white transition hover:bg-[#193B2D] sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
