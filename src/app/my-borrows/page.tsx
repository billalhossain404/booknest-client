import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import ReturnBookButton from "@/components/booking/ReturnBookButton";

import {
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  CircleAlert,
  UserRound,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

// Book Type
type Booking = {
  _id: string;
  title?: string;
  author?: string;
  bookUrl?: string;
  userEmail?: string;
  date?: string;
  returnBy?: string;
};

// Book Cover
function BookCover({ title, image }: { title: string; image?: string }) {
  return (
    <div className="relative flex h-[54px] w-[42px] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-[#e8eee1] shadow-[0_3px_8px_rgba(27,45,34,0.2)] sm:h-[58px] sm:w-[45px]">
      {image ? (
        <Image
          src={image}
          alt={`${title} cover`}
          fill
          unoptimized
          sizes="45px"
          className="object-contain"
        />
      ) : (
        <span className="px-1 text-center font-serif text-[7px] font-semibold text-[#285b48]">
          {title}
        </span>
      )}
    </div>
  );
}

// Stat Card
function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: "green" | "gold" | "red";
}) {
  const styles = {
    green: "bg-[#dce8d6] text-[#2e6048]",
    gold: "bg-[#f1dfb8] text-[#996b27]",
    red: "bg-[#f3d4ca] text-[#a95543]",
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-[#e6e5d9] bg-[#f0f1e7]/80 px-4 py-4 sm:px-5">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${styles[tone]}`}
      >
        <Icon size={22} strokeWidth={1.6} />
      </span>

      <div>
        <p className="text-xs text-[#566258]">{label}</p>
        <p className="mt-0.5 font-serif text-2xl font-semibold leading-none text-[#19372d]">
          {value}
        </p>
      </div>
    </div>
  );
}


// Main Component
const MyBorrows = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  // Fetch Booking Data
  let bookings: Booking[] = [];
  let errorMessage = "";

  if (user?.email) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/my-bookings/${encodeURIComponent(user.email)}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid booking data");
      }

      bookings = data;
    } catch (error) {
      console.error("Booking fetch error:", error);

      errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to load your borrowed books.";
    }
  }

  // Handle Return Book

  const handleReturn = async (formData: FormData) => {
    "use server";

    const bookingId = formData.get("bookingId");

    if (typeof bookingId !== "string" || !bookingId) {
      return {
        success: false,
        message: "Booking ID is missing.",
      };
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/all-bookings/${encodeURIComponent(bookingId)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Failed to return book.",
        };
      }

      // Refresh All Books cache
      revalidatePath("/all-books");

      return {
        success: true,
        message: data.message || "Your book has been returned successfully!",
      };
    } catch (error) {
      console.error("Return error:", error);

      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  };

  // Date Calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Prepare Book Data
  const borrowedBooks = bookings.map((book) => {
    const borrowedDate = book.date ? new Date(book.date) : null;

    const validBorrowedDate =
      borrowedDate && !Number.isNaN(borrowedDate.getTime())
        ? borrowedDate
        : null;

    let returnDate: Date | null = null;

    if (book.returnBy) {
      const parsedDate = new Date(book.returnBy);

      if (!Number.isNaN(parsedDate.getTime())) {
        returnDate = parsedDate;
      }
    } else if (validBorrowedDate) {
      returnDate = new Date(validBorrowedDate);
      returnDate.setDate(returnDate.getDate() + 14);
    }

    const formatDate = (date: Date | null) => {
      if (!date) return "Not set";

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      });
    };

    return {
      id: book._id,
      title: book.title || "Untitled book",
      author: book.author || "Unknown author",
      bookUrl: book.bookUrl || "",
      borrowedOn: formatDate(validBorrowedDate),
      returnBy: formatDate(returnDate),
      returnDate,
    };
  });

  // Statistics
  const borrowedCount = borrowedBooks.length;

  const dueThisWeek = borrowedBooks.filter((book) => {
    if (!book.returnDate) return false;

    return book.returnDate >= today && book.returnDate <= nextWeek;
  }).length;

  const overdueCount = borrowedBooks.filter((book) => {
    if (!book.returnDate) return false;

    return book.returnDate < today;
  }).length;

  return (
    <main className="bg-[#faf9f5] text-[#20372e]">
      <div className="mx-auto flex max-w-[1200px] gap-0 px-0 lg:gap-5 lg:px-3 lg:py-3">
        {/* Sidebar */}
        <aside className="hidden w-[215px] shrink-0 rounded-lg bg-[#edf0e4] px-5 py-5 lg:block">
          <div className="flex items-center gap-3 border-b border-[#d8ddcf] pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#decab0] text-[#29483c]">
              <UserRound size={23} strokeWidth={1.5} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#29483c]">
                {user?.name || "Reader"}
              </p>
              <p className="text-[11px] text-[#6c766c]">Reader</p>
            </div>
          </div>

          <nav className="space-y-1 py-5">
            <Link
              href="/my-books"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-xs text-[#405148] transition hover:bg-white/70"
            >
              <BookOpen size={18} strokeWidth={1.5} />
              My Books
            </Link>

            <Link
              href="/my-borrows"
              className="flex items-center gap-3 rounded-md border-l-2 border-[#b98a35] bg-[#174b39] px-3 py-2.5 text-xs font-medium text-white shadow-sm"
            >
              <BookOpenCheck size={18} strokeWidth={1.5} />
              My Borrows
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-xs text-[#405148] transition hover:bg-white/70"
            >
              <UserRound size={18} strokeWidth={1.5} />
              My Profile
            </Link>
          </nav>

        </aside>

        {/* Main Content */}
        <section className="min-w-0 flex-1 px-4 py-8 sm:px-7 lg:px-0 lg:py-1">
          {/* Header */}
          <header className="mb-5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.24em] text-[#a57931]">
              Your personal library
            </p>

            <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#12372d] sm:text-[42px]">
              Your reading corner
            </h1>

            <p className="mt-1 text-sm text-[#405148]">
              Keep a good story close.
            </p>
          </header>

          {/* Statistics */}
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={BookOpen}
              label="Borrowed books"
              value={borrowedCount}
              tone="green"
            />

            <StatCard
              icon={CalendarDays}
              label="Due this week"
              value={dueThisWeek}
              tone="gold"
            />

            <StatCard
              icon={CircleAlert}
              label="Overdue"
              value={overdueCount}
              tone="red"
            />
          </div>

          {/* My Borrows */}
          <section className="mt-3 rounded-lg border border-[#e5e3d8] bg-white/70 p-4 shadow-[0_8px_24px_rgba(38,60,45,0.03)] sm:p-4">
            <h2 className="mb-3 font-serif text-xl font-semibold text-[#18392e]">
              My Borrows
            </h2>

            {/* Table Header */}
            <div className="hidden grid-cols-[2.4fr_1fr_1fr_0.75fr_0.85fr] rounded-md bg-[#e7eadc] px-3 py-2 text-[10px] font-medium text-[#37493e] sm:grid">
              <span>Book</span>
              <span>Borrowed on</span>
              <span>Return by</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            <div className="divide-y divide-[#ebe9e1]">
              {errorMessage ? (
                <div className="px-4 py-12 text-center text-sm text-red-600">
                  {errorMessage}
                </div>
              ) : borrowedBooks.length > 0 ? (
                borrowedBooks.map((book) => {
                  const isOverdue =
                    book.returnDate !== null && book.returnDate < today;

                  return (
                    <div
                      key={book.id}
                      className="grid gap-3 px-2 py-3.5 sm:grid-cols-[2.4fr_1fr_1fr_0.75fr_0.85fr] sm:items-center sm:px-3"
                    >
                      {/* Book */}
                      <div className="flex items-center gap-4">
                        <BookCover title={book.title} image={book.bookUrl} />

                        <div className="min-w-0">
                          <h3 className="truncate font-serif text-sm font-semibold text-[#213b30]">
                            {book.title}
                          </h3>

                          <p className="truncate text-[10px] text-[#6d756e]">
                            {book.author}
                          </p>
                        </div>
                      </div>

                      {/* Borrowed On */}
                      <div className="flex justify-between text-xs text-[#59645c] sm:block">
                        <span className="sm:hidden">Borrowed on</span>
                        {book.borrowedOn}
                      </div>

                      {/* Return By */}
                      <div className="flex justify-between text-xs text-[#59645c] sm:block">
                        <span className="sm:hidden">Return by</span>
                        {book.returnBy}
                      </div>

                      {/* Status */}
                      <span
                        className={`inline-flex w-fit items-center gap-2 rounded-full px-2.5 py-1 text-[10px] ${
                          isOverdue
                            ? "bg-[#f3d4ca] text-[#a95543]"
                            : "bg-[#e8eee1] text-[#335541]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isOverdue ? "bg-[#a95543]" : "bg-[#1e6849]"
                          }`}
                        />

                        {isOverdue ? "Overdue" : "On loan"}
                      </span>

                      {/* Return Button */}
                      <ReturnBookButton
                        bookingId={book.id}
                        action={handleReturn}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-12 text-center text-sm text-[#68746a]">
                  You haven&apos;t borrowed any books yet.
                </div>
              )}
            </div>
          </section>

          {/* Bottom Banner */}
          <div className="mt-3 flex flex-col gap-3 rounded-lg bg-[#e8eee1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <BookOpenCheck
                className="text-[#2e6048]"
                size={28}
                strokeWidth={1.3}
              />

              <div className="border-l border-[#c4cdbd] pl-4">
                <p className="font-serif text-base font-semibold text-[#1d3d30]">
                  Finished your chapter?
                </p>

                <p className="text-[11px] text-[#516157]">
                  Return your book so another reader can enjoy it.
                </p>
              </div>
            </div>

            <Link
              href="/all-books"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#174b39] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#103b2d]"
            >
              Browse more books
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default MyBorrows;
