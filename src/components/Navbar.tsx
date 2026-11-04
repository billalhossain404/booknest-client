"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBook } from "@tabler/icons-react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import UserInfo from "./UserInfo";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/all-books" },
    { name: "Add Book", href: "/add-books" },
    { name: "My Books", href: "/my-books" },
    { name: "My Borrow", href: "/my-borrows" },
  ];

  // Logged out: Only Home and All Books
  // Logged in: Show all navigation links
  const visibleNavLinks = user
    ? navLinks
    : navLinks.filter(
        (link) => link.name === "Home" || link.name === "All Books",
      );

  return (
    <header className="w-full border-b border-[#EAE6DC] bg-[#FAF9F5]">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-2 px-2 sm:gap-4 sm:px-6">
        <Link href="/" className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2">
          <IconBook
            stroke={1.5}
            size={38}
            className="h-8 w-8 shrink-0 text-[#234D3C] sm:h-[60px] sm:w-[60px]"
          />

          <span className="truncate text-lg font-normal text-[#234D3C] sm:text-3xl">
            {" "}
            BookNest{" "}
          </span>
        </Link>

        {/* Desktop Navigation */}

        {!isPending && (
          <nav className="hidden items-center gap-6 lg:flex">
            {visibleNavLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative whitespace-nowrap py-2 text-[17px] font-normal transition-colors hover:text-[#234D3C] ${
                    isActive ? "text-[#234D3C]" : "text-[#535B53]"
                  }`}
                >
                  {link.name}

                  {isActive && link.name !== "My Borrow" && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#C8A76A]" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex shrink-0 items-center gap-1 [&_a:first-child]:text-xs [&_a:last-child]:px-2 [&_a:last-child]:py-2 sm:gap-3 sm:[&_a:first-child]:text-[17px] sm:[&_a:last-child]:px-5 sm:[&_a:last-child]:py-3">
          <UserInfo />

          {/* Mobile Hamburger Menu */}

          <button
            type="button"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-md p-1.5 text-[#234D3C] hover:bg-[#F0EEE6] sm:p-2 lg:hidden"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}

        {!isPending && isMenuOpen && (
          <nav className="order-3 basis-full border-t border-[#EAE6DC] py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {visibleNavLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-md px-3 py-2 text-base transition-colors hover:bg-[#F0EEE6] ${
                      isActive ? "text-[#234D3C]" : "text-[#535B53]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
