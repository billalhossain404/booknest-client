"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { IconBook } from "@tabler/icons-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/books" },
    { name: "Add Book", href: "/books/new" },
    { name: "My Books", href: "/my-books" },
    { name: "My Borrow", href: "/my-borrow" },
  ];

  return (
    <header className="w-full border-b border-[#EAE6DC] bg-[#FAF9F5]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="flex items-center gap-2">
          <IconBook stroke={1.5} size={60} className="text-[#234D3C]" />
          <span className="text-3xl font-normal text-[#234D3C]">
            {" "}
            BookNest{" "}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
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
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
