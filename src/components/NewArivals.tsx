
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Book = {
  _id?: string;
  title?: string;
  author?: string;
  category?: string;
  bookUrl?: string;
  publishedYear?: string | number;
};

type BooksResponse = {
  success?: boolean;
  books?: Book[];
  message?: string;
};

const API_URL = "http://localhost:8000/all-books";

function BookCover({ book }: { book: Book }) {
  if (!book.bookUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#e8e4d8] px-3 text-center text-[#234d3c]">
        <BookOpen className="mb-2 size-8 opacity-60" strokeWidth={1.3} />
        <span className="font-serif text-sm font-semibold leading-tight">
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
      sizes="(max-width: 640px) 34vw, (max-width: 1024px) 20vw, 150px"
      className="object-cover"
    />
  );
}

function ArrivalCard({ book }: { book: Book }) {
  return (
    <Card className="grid min-h-[175px] grid-cols-[78px_1fr] gap-3 rounded-xl border-[#ebe6d9] bg-[#fbfaf6] p-2.5 shadow-none transition-shadow hover:shadow-[0_8px_20px_rgba(35,77,60,0.1)] sm:min-h-[175px] sm:grid-cols-[78px_1fr]">
      <div className="relative min-h-[150px] overflow-hidden rounded-md bg-[#e8e4d8] shadow-[0_3px_8px_rgba(35,55,43,0.16)]">
        <BookCover book={book} />
      </div>

      <CardContent className="flex min-w-0 flex-col px-0 py-1">
        <p className="truncate text-[9px] font-medium uppercase tracking-[0.16em] text-[#a47b3d]">
          {book.category || "New arrival"}
        </p>
        <h3 className="mt-1 line-clamp-2 font-serif text-base font-semibold leading-tight text-[#18342c]">
          {book.title || "Untitled book"}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-[#73766f]">
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
          size="sm"
          className="mt-auto h-7 w-fit border-[#d6b77d] px-3 text-[10px] font-medium text-[#9b6b27] hover:bg-[#234d3c] hover:text-white"
        >
          View Details
          <ArrowRight className="size-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default async function NewArivals() {
  let books: Book[] = [];
  let errorMessage = "";

  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    const data = (await response.json()) as BooksResponse;

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Unable to load new arrivals.");
    }

    books = Array.isArray(data.books) ? data.books : [];
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unable to load new arrivals.";
  }

  const newestBooks = [...books]
    .sort((first, second) => {
      const firstYear = Number(first.publishedYear) || 0;
      const secondYear = Number(second.publishedYear) || 0;
      return secondYear - firstYear;
    })
    .slice(0, 8);

  return (
    <section className="bg-[#faf9f5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#18342c] sm:text-4xl">
              New Arrivals
            </h2>
            <p className="mt-1 text-sm text-[#68736b]">
              Fresh reads from our community shelves. Be the first to borrow
              these new additions.
            </p>
          </div>
          <Link
            href="/all-books"
            className="hidden shrink-0 items-center gap-1 text-xs font-medium text-[#986c2e] transition-colors hover:text-[#234d3c] sm:flex"
          >
            View all books
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {errorMessage ? (
          <Card className="border-[#eadfd0] bg-[#fffdf8] p-6 text-center shadow-none">
            <p className="text-sm text-[#7b6250]">{errorMessage}</p>
          </Card>
        ) : newestBooks.length === 0 ? (
          <Card className="border-[#eadfd0] bg-[#fffdf8] p-6 text-center shadow-none">
            <p className="text-sm text-[#68736b]">No new arrivals found.</p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {newestBooks.map((book, index) => (
              <ArrivalCard key={book._id || `${book.title}-${index}`} book={book} />
            ))}
          </div>
        )}

        <Link
          href="/all-books"
          className="mt-4 flex items-center justify-center gap-1 text-xs font-medium text-[#986c2e] sm:hidden"
        >
          View all books
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}