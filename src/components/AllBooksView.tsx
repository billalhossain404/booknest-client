"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type Book = {
  _id?: string;
  title: string;
  author: string;
  category: string;
  description?: string;
  bookUrl?: string;
  publishedYear?: string | number;
};

type AllBooksViewProps = {
  books: Book[];
  errorMessage: string;
};

const categories = ["All Books", "Fiction", "Science", "History", "Kids", "Others"];

function getCategory(book: Book) {
  const category = book.category?.toLowerCase() || "";

  if (category.includes("non-fiction")) return "Others";
  if (category.includes("fiction") && !category.includes("science")) return "Fiction";
  if (category.includes("science")) return "Science";
  if (category.includes("history")) return "History";
  if (category.includes("kid") || category.includes("children")) return "Kids";
  return "Others";
}

function BookCover({ book }: { book: Book }) {
  const [hasError, setHasError] = useState(false);

  if (!book.bookUrl || hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#e6eee6] px-4 text-center text-[#285b48]">
        <BookOpen className="mb-3 size-10 opacity-70" strokeWidth={1.4} />
        <span className="font-serif text-lg font-semibold leading-tight">
          {book.title}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={book.bookUrl}
      alt={`${book.title} cover`}
      fill
      unoptimized
      sizes="(max-width: 640px) 38vw, 180px"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setHasError(true)}
    />
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <Card className="group grid min-h-[225px] grid-cols-[116px_1fr] gap-5 rounded-2xl border border-[#dde3d8] bg-[#f7f8f0]/80 p-3 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-[#9dbca9] hover:bg-[#f5f8ee] hover:shadow-[0_12px_28px_rgba(27,65,48,0.12)] sm:grid-cols-[150px_1fr] sm:gap-5 sm:p-3">
      <div className="relative min-h-[198px] overflow-hidden rounded-xl bg-[#e6eee6] shadow-[0_4px_12px_rgba(28,55,43,0.16)]">
        <BookCover book={book} />
      </div>

      <CardContent className="flex min-w-0 flex-col px-0 py-2 pr-2">
        <div>
          <h2 className="line-clamp-2 font-serif text-xl font-bold leading-tight text-[#172d26] sm:text-[22px]">
            {book.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-[#68736b] sm:text-base">
            {book.author}
          </p>
        </div>

        <Badge
          variant="secondary"
          className="mt-3 w-fit rounded-full bg-[#e6eadb] px-3 py-1 text-[11px] font-medium text-[#365444]"
        >
          {book.category}
        </Badge>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e1f0df] px-2.5 py-1 text-xs font-medium text-[#23603f]">
            <span className="size-2 rounded-full bg-[#15803d]" />
            Available
          </span>

          <a
            href={book.bookUrl || undefined}
            target={book.bookUrl ? "_blank" : undefined}
            rel={book.bookUrl ? "noreferrer" : undefined}
            aria-disabled={!book.bookUrl}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#a66e1d] underline-offset-4 transition-colors hover:text-[#744a10] hover:underline"
          >
            View Details
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AllBooksView({
  books,
  errorMessage,
}: AllBooksViewProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Books");
  const [sort, setSort] = useState("Newest first");

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = books.filter((book) => {
      const matchesSearch =
        !query ||
        [book.title, book.author, book.category, book.description]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));
      const matchesCategory =
        category === "All Books" || getCategory(book) === category;

      return matchesSearch && matchesCategory;
    });

    return [...result].sort((a, b) => {
      if (sort === "Title A-Z") return a.title.localeCompare(b.title);
      if (sort === "Title Z-A") return b.title.localeCompare(a.title);
      return Number(b.publishedYear || 0) - Number(a.publishedYear || 0);
    });
  }, [books, category, search, sort]);

  return (
    <main className="min-h-[calc(100vh-10rem)] bg-[#fbfaf5] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <header className="relative mb-8 overflow-hidden rounded-3xl bg-[#f5f4ed] px-5 py-8 sm:px-10 sm:py-10">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#2d6a52]">
              The BookNest collection
            </p>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-[#102d25] sm:text-5xl lg:text-6xl">
              Find your next chapter.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#68736b] sm:text-base">
              Borrow books, meet fellow readers, and be part of a kinder,
              greener reading community.
            </p>
          </div>
          <BookOpen className="absolute -bottom-8 -right-4 size-44 rotate-12 text-[#dce5d4] sm:right-8 sm:size-56" strokeWidth={0.7} />
        </header>

        <section aria-label="Book filters" className="mb-8 space-y-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_230px_215px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#254f40]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, author, or keyword..."
                aria-label="Search books"
                className="h-11 rounded-xl border-[#d9ddd8] bg-white pl-12 text-sm shadow-none focus-visible:border-[#2d6a52] focus-visible:ring-[#2d6a52]/20"
              />
            </div>
            <label className="relative">
              <span className="sr-only">Filter by category</span>
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#496055]" />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#d9ddd8] bg-white pl-10 pr-9 text-sm text-[#33423a] outline-none focus:border-[#2d6a52] focus:ring-3 focus:ring-[#2d6a52]/20"
              >
                <option>All Books</option>
                {categories.slice(1).map((item) => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#254f40]" />
            </label>
            <label className="relative">
              <span className="sr-only">Sort books</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#d9ddd8] bg-white px-3 pr-9 text-sm text-[#33423a] outline-none focus:border-[#2d6a52] focus:ring-3 focus:ring-[#2d6a52]/20"
              >
                <option>Newest first</option>
                <option>Title A-Z</option>
                <option>Title Z-A</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#254f40]" />
            </label>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <Button
                key={item}
                type="button"
                variant={category === item ? "default" : "secondary"}
                onClick={() => setCategory(item)}
                className={`h-9 shrink-0 rounded-full px-5 text-xs ${
                  category === item
                    ? "bg-[#174f3d] text-white hover:bg-[#123e30]"
                    : "bg-[#e9eadc] text-[#385548] hover:bg-[#dde4d8]"
                }`}
              >
                {item}
              </Button>
            ))}
          </div>
        </section>

        {errorMessage ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cbd6cc] bg-white/70 px-5 py-16 text-center">
            <BookOpen className="mx-auto mb-3 size-10 text-[#7a9a87]" />
            <h2 className="font-serif text-2xl font-semibold text-[#1d3c30]">No books found</h2>
            <p className="mt-2 text-sm text-[#68736b]">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book, index) => (
              <BookCard key={book._id || `${book.title}-${index}`} book={book} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
