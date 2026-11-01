"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { ChevronDown, UserRound, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const UserInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      {user ? (
        <>
          {/* Profile Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-200 hover:bg-[#F3F5F0]"
          >
            <div className="flex flex-col items-center gap-1">
              <Image
                src={user.image || "/images/default-avatar.png"}
                alt={user.name || "User"}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full border border-[#E5E0D5] object-cover"
              />

              <span className="max-w-[120px] truncate text-[13px] font-semibold text-[#234D3C]">
                {user.name}
              </span>
            </div>
          </button>

          {/* Animated Dropdown */}
          <div
            className={`absolute right-0 top-full z-50 w-[320px] pt-3 origin-top-right transition-all duration-300 ease-out ${
              isOpen
                ? "visible translate-y-0 scale-100 opacity-100"
                : "invisible -translate-y-3 scale-95 opacity-0 pointer-events-none"
            }`}
          >
            <div className="overflow-hidden rounded-[20px] border border-[#EAE6DC] bg-white shadow-[0_15px_45px_rgba(30,55,42,0.13)]">
              {/* User Information */}
              <div className="px-6 pb-5 pt-6">
                <h3 className="truncate text-[19px] font-bold text-[#263449]">
                  {user.name || "User"}
                </h3>

                <p className="mt-1 truncate text-[15px] text-[#758096]">
                  {user.email}
                </p>
              </div>

              <div className="mx-6 border-t border-[#EEECE6]" />

              {/* Menu Items */}
              <div className="space-y-1 px-4 py-4">
                {/* My Profile */}
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-3 rounded-lg px-3 py-3 text-[16px] font-medium text-[#475569] transition-all duration-200 hover:bg-[#F3F5F0] hover:pl-4 hover:text-[#234D3C]"
                >
                  <UserRound
                    size={19}
                    strokeWidth={1.8}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />

                  <span>My Profile</span>
                </Link>

                {/* Sign Out */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[16px] font-medium text-[#EF4444] transition-all duration-200 hover:bg-red-50 hover:pl-4"
                >
                  <LogOut
                    size={19}
                    strokeWidth={1.8}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />

                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Login and Signup */
        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/sign-in"
            className="whitespace-nowrap text-[17px] font-medium text-[#234D3C] transition-colors hover:text-[#B18B4F]"
          >
            Login
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-[#234D3C] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#18382C]"
          >
            Join the library
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
