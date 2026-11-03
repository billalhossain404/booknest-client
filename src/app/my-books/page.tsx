"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Library,
  Plus,
  RefreshCw,
  Search,
  Tags,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Book = {
  _id?: string;
  title?: string;
  author?: string;
  category?: string;
  description?: string;
  bookUrl?: string;
  publishedYear?: string | number;
};

type BooksResponse = {
  books?: Book[];
  message?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function BookCover({ book }: { book: Book }) {
  if (!book.bookUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#e8eee1] px-4 text-center text-[#285b48]">
        <BookOpen className="mb-3 size-10 opacity-60" strokeWidth={1.3} />
        <span className="font-serif text-lg font-semibold leading-tight">
          {book.title || "Untitled book"}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={book.bookUrl}
      alt={`${book.title || "Book"} cover`}
      fill
      unoptimized
      sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 180px"
      className="object-cover transition duration-500 group-hover:scale-105"
    />
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-[#e1e6dd] bg-white shadow-[0_8px_24px_rgba(27,65,48,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#9dbca9] hover:shadow-[0_16px_32px_rgba(27,65,48,0.12)]">
      <div className="relative m-3 h-64 overflow-hidden rounded-xl bg-[#e8eee1] shadow-[0_4px_12px_rgba(28,55,43,0.16)]">
        <BookCover book={book} />
      </div>

      <CardContent className="flex min-w-0 flex-col px-4 pb-5 pt-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a47b3d]">
            {book.category || "Uncategorized"}
          </p>
          {book.publishedYear && (
            <span className="shrink-0 text-xs text-[#879087]">
              {book.publishedYear}
            </span>
          )}
        </div>
        <h2 className="mt-1 line-clamp-2 min-h-12 font-serif text-xl font-semibold leading-tight text-[#172d26]">
          {book.title || "Untitled book"}
        </h2>
        <p className="mt-1 line-clamp-1 text-sm text-[#68736b]">
          {book.author || "Unknown author"}
        </p>

        <Button
          nativeButton={false}
          render={
            <Link
              href={book._id ? `/all-books/${book._id}` : "/all-books"}
              aria-label={`View details for ${book.title || "this book"}`}
            />
          }
          variant="outline"
          className="mt-5 w-full border-[#d6b77d] text-[#9b6b27] hover:bg-[#234d3c] hover:text-white"
        >
          View details
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#e1e6dd] bg-white px-4 py-4 shadow-[0_6px_18px_rgba(27,65,48,0.04)]">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8eee1] text-[#285b48]">
        <Icon className="size-5" strokeWidth={1.7} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-[#778078]">{label}</p>
        <p className="mt-0.5 truncate font-serif text-2xl font-semibold leading-none text-[#18342c]">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function MyBooks() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userId = session?.user?.id;

  const loadBooks = async (id: string) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/my-books/${encodeURIComponent(id)}`,
        { cache: "no-store" },
      );
      const data = (await response.json()) as Book[] | BooksResponse;

      if (!response.ok) {
        throw new Error(
          !Array.isArray(data) && data.message
            ? data.message
            : "Unable to load your books.",
        );
      }

      setBooks(Array.isArray(data) ? data : data.books || []);
    } catch (error) {
      setBooks([]);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load your books.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const task = window.setTimeout(() => {
      void loadBooks(userId);
    }, 0);

    return () => window.clearTimeout(task);
  }, [userId]);

  const categories = useMemo(() => {
    const values = books
      .map((book) => book.category?.trim())
      .filter((value): value is string => Boolean(value));
    return ["All categories", ...Array.from(new Set(values)).sort()];
  }, [books]);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return books.filter((book) => {
      const matchesCategory =
        category === "All categories" || book.category === category;
      const matchesSearch =
        !query ||
        [book.title, book.author, book.category].some((value) =>
          value?.toLowerCase().includes(query),
        );
      return matchesCategory && matchesSearch;
    });
  }, [books, category, search]);

  const hasFilters = Boolean(search.trim()) || category !== "All categories";

  return (
    <main className="min-h-screen bg-[#faf9f5] px-4 py-8 text-[#20372e] sm:px-6 lg:px-8 lg:py-12">
      <section className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-3xl bg-[#1f5a43] px-6 py-8 text-white shadow-[0_18px_40px_rgba(31,90,67,0.16)] sm:px-10 sm:py-10">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#dfc58e]">
              Your collection
            </p>
            <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              My Books
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#d9e8dc] sm:text-base">
              Keep every story you have shared with the BookNest community in
              one beautiful, easy-to-browse shelf.
            </p>
          </div>
          <BookOpen
            aria-hidden="true"
            className="absolute -bottom-8 -right-4 size-48 rotate-12 text-white/10 sm:size-64"
            strokeWidth={1}
          />
        </header>

        <div className="my-6 grid gap-3 sm:grid-cols-3">
          <Stat icon={Library} label="Books shared" value={books.length} />
          <Stat
            icon={Tags}
            label="Categories"
            value={Math.max(categories.length - 1, 0)}
          />
          <Stat
            icon={BookOpen}
            label="Showing"
            value={filteredBooks.length}
          />
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#e1e6dd] bg-white p-3 shadow-[0_6px_18px_rgba(27,65,48,0.04)] sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#879087]"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, author, or category..."
              aria-label="Search your books"
              className="h-11 border-[#e1e6dd] pl-9 shadow-none focus-visible:border-[#2d6a52] focus-visible:ring-[#2d6a52]/20"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
            className="h-11 rounded-lg border border-[#e1e6dd] bg-white px-3 text-sm text-[#405148] outline-none focus:border-[#2d6a52] focus:ring-3 focus:ring-[#2d6a52]/20 sm:w-48"
          >
            {categories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            disabled={!userId || isLoading}
            onClick={() => userId && void loadBooks(userId)}
            className="h-11 border-[#d6b77d] text-[#9b6b27] hover:bg-[#234d3c] hover:text-white"
          >
            <RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />
            Refresh
          </Button>
        </div>

        {isSessionPending || isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-[390px] animate-pulse rounded-2xl bg-[#e9ede6]"
              />
            ))}
          </div>
        ) : errorMessage ? (
          <Card className="border-[#eadfd0] bg-[#fffdf8] p-10 text-center shadow-none">
            <p className="text-sm text-[#7b6250]">{errorMessage}</p>
            {userId && (
              <Button
                type="button"
                onClick={() => void loadBooks(userId)}
                className="mt-5 bg-[#1f5a43] text-white hover:bg-[#174936]"
              >
                Try again
              </Button>
            )}
          </Card>
        ) : !session?.user ? (
          <Card className="border-[#eadfd0] bg-[#fffdf8] p-10 text-center shadow-none">
            <BookOpen className="mx-auto mb-4 size-10 text-[#a47b3d]" />
            <h2 className="font-serif text-2xl font-semibold text-[#18342c]">
              Your shelf is waiting
            </h2>
            <p className="mt-2 text-sm text-[#68736b]">
              Please sign in to see the books you have uploaded.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/sign-in" />}
              className="mt-5 bg-[#1f5a43] text-white hover:bg-[#174936]"
            >
              Sign in
            </Button>
          </Card>
        ) : books.length === 0 ? (
          <Card className="border-[#eadfd0] bg-[#fffdf8] p-10 text-center shadow-none">
            <BookOpen className="mx-auto mb-4 size-10 text-[#a47b3d]" />
            <h2 className="font-serif text-2xl font-semibold text-[#18342c]">
              Start your collection
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#68736b]">
              You have not uploaded any books yet. Add your first title and
              make it available to fellow readers.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/add-books" />}
              className="mt-5 bg-[#1f5a43] text-white hover:bg-[#174936]"
            >
              <Plus className="size-4" />
              Add a book
            </Button>
          </Card>
        ) : filteredBooks.length === 0 ? (
          <Card className="border-[#eadfd0] bg-[#fffdf8] p-10 text-center shadow-none">
            <Search className="mx-auto mb-4 size-9 text-[#a47b3d]" />
            <h2 className="font-serif text-2xl font-semibold text-[#18342c]">
              No matching books
            </h2>
            <p className="mt-2 text-sm text-[#68736b]">
              Try a different search term or category.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategory("All categories");
              }}
              className="mt-5 border-[#d6b77d] text-[#9b6b27]"
            >
              Clear filters
            </Button>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[#68736b]">
                {hasFilters
                  ? `${filteredBooks.length} result${filteredBooks.length === 1 ? "" : "s"}`
                  : "All your shared books"}
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/add-books" />}
                variant="ghost"
                className="h-9 text-[#285b48] hover:bg-[#e8eee1]"
              >
                <Plus className="size-4" />
                Add book
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredBooks.map((book, index) => (
                <BookCard
                  key={book._id || `${book.title}-${index}`}
                  book={book}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
