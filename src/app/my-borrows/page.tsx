 "use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  CalendarDays,
  CircleAlert,
  LogOut,
  UserRound,
} from "lucide-react";

type BorrowedBook = {
  id: number;
  title: string;
  author: string;
  borrowedOn: string;
  returnBy: string;
  cover: string;
  coverTone: string;
};

const initialBooks: BorrowedBook[] = [
  {
    id: 1,
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    borrowedOn: "May 2, 2025",
    returnBy: "May 23, 2025",
    cover: "The\nSecret\nGarden",
    coverTone: "from-[#284f36] via-[#78914b] to-[#d4b674]",
  },
  {
    id: 2,
    title: "Little Women",
    author: "Louisa May Alcott",
    borrowedOn: "Apr 28, 2025",
    returnBy: "May 19, 2025",
    cover: "Little\nWomen",
    coverTone: "from-[#73513b] via-[#bd9a69] to-[#e0c599]",
  },
  {
    id: 3,
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    borrowedOn: "May 5, 2025",
    returnBy: "May 26, 2025",
    cover: "The Little\nPrince",
    coverTone: "from-[#183d68] via-[#31658d] to-[#dba84e]",
  },
];

function BookCover({ book }: { book: BorrowedBook }) {
  return (
    <div
      className={`flex h-[54px] w-[42px] shrink-0 items-center justify-center bg-gradient-to-br ${book.coverTone} p-1 text-center text-[7px] font-semibold leading-[1.05] text-[#fff9e8] shadow-[0_3px_8px_rgba(27,45,34,0.2)] sm:h-[58px] sm:w-[45px]`}
      aria-label={`${book.title} cover`}
    >
      <span className="whitespace-pre-line border border-white/50 px-1 py-1">
        {book.cover}
      </span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof BookOpen;
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
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${styles[tone]}`}>
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

export default function MyBorrowsPage() {
  const [books, setBooks] = useState(initialBooks);
  const borrowedCount = books.length;
  const dueThisWeek = useMemo(() => books.length > 0 ? 2 : 0, [books.length]);

  const returnBook = (id: number) => {
    setBooks((currentBooks) => currentBooks.filter((book) => book.id !== id));
  };

  return (
    <main className="bg-[#faf9f5] text-[#20372e]">
      <div className="mx-auto flex max-w-[1200px] gap-0 px-0 lg:gap-5 lg:px-3 lg:py-3">
        <aside className="hidden w-[215px] shrink-0 rounded-lg bg-[#edf0e4] px-5 py-5 lg:block">
          <div className="flex items-center gap-3 border-b border-[#d8ddcf] pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#decab0] text-[#29483c]">
              <UserRound size={23} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#29483c]">Emma Chen</p>
              <p className="text-[11px] text-[#6c766c]">Reader</p>
            </div>
          </div>
          <nav className="space-y-1 py-5">
            <Link href="/all-books" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-xs text-[#405148] transition hover:bg-white/70">
              <BookOpen size={18} strokeWidth={1.5} /> My Books
            </Link>
            <Link href="/my-borrows" className="flex items-center gap-3 rounded-md border-l-2 border-[#b98a35] bg-[#174b39] px-3 py-2.5 text-xs font-medium text-white shadow-sm">
              <BookOpenCheck size={18} strokeWidth={1.5} /> My Borrows
            </Link>
            <Link href="/profile" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-xs text-[#405148] transition hover:bg-white/70">
              <UserRound size={18} strokeWidth={1.5} /> My Profile
            </Link>
          </nav>
          <div className="border-t border-[#d8ddcf] pt-5">
            <button type="button" className="flex items-center gap-3 px-3 py-2.5 text-xs text-[#405148] transition hover:text-[#174b39]">
              <LogOut size={18} strokeWidth={1.5} /> Log out
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-8 sm:px-7 lg:px-0 lg:py-1">
          <header className="mb-5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.24em] text-[#a57931]">Your personal library</p>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#12372d] sm:text-[42px]">
              Your reading corner
            </h1>
            <p className="mt-1 text-sm text-[#405148]">Keep a good story close.</p>
          </header>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard icon={BookOpen} label="Borrowed books" value={borrowedCount} tone="green" />
            <StatCard icon={CalendarDays} label="Due this week" value={dueThisWeek} tone="gold" />
            <StatCard icon={CircleAlert} label="Overdue" value={0} tone="red" />
          </div>

          <section className="mt-3 rounded-lg border border-[#e5e3d8] bg-white/70 p-4 shadow-[0_8px_24px_rgba(38,60,45,0.03)] sm:p-4">
            <h2 className="mb-3 font-serif text-xl font-semibold text-[#18392e]">My Borrows</h2>
            <div className="hidden grid-cols-[2.4fr_1fr_1fr_0.75fr_0.85fr] rounded-md bg-[#e7eadc] px-3 py-2 text-[10px] font-medium text-[#37493e] sm:grid">
              <span>Book</span><span>Borrowed on</span><span>Return by</span><span>Status</span><span>Action</span>
            </div>
            <div className="divide-y divide-[#ebe9e1]">
              {books.length > 0 ? books.map((book) => (
                <div key={book.id} className="grid gap-3 px-2 py-3.5 sm:grid-cols-[2.4fr_1fr_1fr_0.75fr_0.85fr] sm:items-center sm:px-3">
                  <div className="flex items-center gap-4">
                    <BookCover book={book} />
                    <div className="min-w-0">
                      <h3 className="truncate font-serif text-sm font-semibold text-[#213b30]">{book.title}</h3>
                      <p className="truncate text-[10px] text-[#6d756e]">{book.author}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-[#59645c] sm:block"><span className="sm:hidden">Borrowed on</span>{book.borrowedOn}</div>
                  <div className="flex justify-between text-xs text-[#59645c] sm:block"><span className="sm:hidden">Return by</span>{book.returnBy}</div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e8eee1] px-2.5 py-1 text-[10px] text-[#335541]"><span className="h-1.5 w-1.5 rounded-full bg-[#1e6849]" /> On loan</span>
                  <button type="button" onClick={() => returnBook(book.id)} className="w-full rounded-md border border-[#c99c50] px-2 py-2 text-[10px] font-medium text-[#9a6a22] transition hover:bg-[#fcf4e3] sm:w-auto">Return Book</button>
                </div>
              )) : (
                <div className="px-4 py-12 text-center text-sm text-[#68746a]">You have returned all your books.</div>
              )}
            </div>
          </section>

          <div className="mt-3 flex flex-col gap-3 rounded-lg bg-[#e8eee1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <BookOpenCheck className="text-[#2e6048]" size={28} strokeWidth={1.3} />
              <div className="border-l border-[#c4cdbd] pl-4">
                <p className="font-serif text-base font-semibold text-[#1d3d30]">Finished your chapter?</p>
                <p className="text-[11px] text-[#516157]">Return your book so another reader can enjoy it.</p>
              </div>
            </div>
            <Link href="/all-books" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#174b39] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#103b2d]">
              Browse more books <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}