import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  RotateCcw,
  UsersRound,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import BookingCard from "@/components/booking/BookingCard";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

type Book = {
  _id?: string;
  title?: string;
  author?: string;
  category?: string;
  description?: string;
  bookUrl?: string;
  publishedYear?: string | number;
  owner?: string;
  ownerName?: string;
  sharedBy?: string;
  availableCopies?: number;
  totalCopies?: number;
  copies?: number;
};

type BookResponse = Book & {
  success?: boolean;
  book?: Book;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/all-books`;

// Book Image Component
function BookImage({ book }: { book: Book }) {
  if (!book.bookUrl) {
    return (
      <div className="flex h-full min-h-[360px] w-full flex-col items-center justify-center bg-[#e6eee6] px-8 text-center text-[#285b48] md:min-h-[560px]">
        <BookOpen className="mb-5 size-16 opacity-60" strokeWidth={1.2} />

        <span className="font-serif text-2xl font-semibold">{book.title}</span>
      </div>
    );
  }

  return (
    <Image
      src={book.bookUrl}
      alt={`${book.title || "Book"} cover`}
      fill
      priority
      unoptimized
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-contain p-8 drop-shadow-[0_16px_18px_rgba(27,65,48,0.2)] sm:p-12"
    />
  );
}

// Main Page
export default async function SingleBookDetails({ params }: PageProps) {
  const { id } = await params;

  let book: Book | null = null;
  let errorMessage = "";

  const token = await getTokenFromServer();

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = (await response.json()) as BookResponse;

    if (!response.ok) {
      throw new Error("Unable to load this book.");
    }

    book = data.book || data;
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unable to load this book.";
  }

  if (!book) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="max-w-md rounded-2xl border-[#e1e5d9] bg-[#fbfcf7] text-center shadow-none">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-[#173c2e]">
              Book unavailable
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-[#68736b]">
              {errorMessage || "We could not find this book."}
            </p>

            <Link
              href="/all-books"
              className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-[#174b39] px-3 text-sm font-medium text-white hover:bg-[#123c2e]"
            >
              Back to all books
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Borrowing Guidelines
  const guidelines: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
  }> = [
    {
      icon: RotateCcw,
      title: "Return in good condition",
      description: "Keep it clean and free from major damage.",
    },
    {
      icon: UsersRound,
      title: "Be considerate",
      description: "Return on time so others can enjoy it too.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fcfbf7] px-4 py-6 text-[#173c2e] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav
          className="mb-6 flex items-center gap-2 text-sm text-[#68736b]"
          aria-label="Breadcrumb"
        >
          <Link className="transition-colors hover:text-[#174b39]" href="/">
            Home
          </Link>

          <span>/</span>

          <Link
            className="transition-colors hover:text-[#174b39]"
            href="/all-books"
          >
            All Books
          </Link>

          <span>/</span>

          <span className="truncate text-[#4c5750]">{book.title}</span>
        </nav>

        {/* Book Details */}
        <section className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          {/* Book Image */}
          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl bg-[#e8ede1] shadow-[0_12px_30px_rgba(27,65,48,0.12)] sm:min-h-[560px]">
            <BookImage book={book} />
          </div>

          {/* Book Information */}
          <div className="flex flex-col justify-center py-2 lg:py-8">
            <Badge className="w-fit rounded-full bg-[#e6eadb] px-4 py-1.5 text-sm font-medium text-[#365444] hover:bg-[#e6eadb]">
              {book.category || "Book"}
            </Badge>

            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.05] tracking-tight text-[#123b2e] sm:text-5xl">
              {book.title || "Untitled book"}
            </h1>

            <p className="mt-3 text-xl text-[#285b48]">
              {book.author || "Unknown author"}
            </p>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#59645c]">
              {book.description ||
                "Discover this title from the BookNest collection."}
            </p>

            {/* Booking Card */}
            <BookingCard book={book} />

            <p className="mt-3 text-center text-sm text-[#68736b]">
              Return anytime from My Borrows.
            </p>
          </div>
        </section>

        {/* Additional Information */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          {/* About Book */}
          <Card className="rounded-2xl border-[#e4e6d9] bg-[#fffefa] py-0 shadow-none">
            <CardHeader className="px-6 pt-6 sm:px-7">
              <CardTitle className="font-serif text-2xl text-[#173c2e]">
                About this book
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-7 text-base leading-7 text-[#59645c] sm:px-7">
              <p>
                {book.description ||
                  "No description has been added for this book yet."}
              </p>

              {book.publishedYear && (
                <p className="mt-5 flex items-center gap-2 text-sm text-[#68736b]">
                  <CalendarDays className="size-4" />
                  Published in {book.publishedYear}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Borrowing Guidelines */}
          <Card className="rounded-2xl border-[#e0e5d6] bg-[#eaf0df] py-0 shadow-none">
            <CardHeader className="px-6 pt-6 sm:px-7">
              <CardTitle className="font-serif text-2xl text-[#173c2e]">
                Borrowing guidelines
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-0 px-6 pb-5 sm:px-7">
              {guidelines.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-3 border-b border-[#d8dfce] py-3 last:border-0"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#dce6d3] text-[#275747]">
                    <Icon className="size-5" strokeWidth={1.7} />
                  </span>

                  <div>
                    <p className="pt-1 text-sm font-semibold text-[#294638]">
                      {title}
                    </p>

                    <p className="mt-1 text-sm text-[#68736b]">{description}</p>
                  </div>

                  <Check className="ml-auto mt-2 hidden size-4 text-[#52735c] sm:block" />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Back Button */}
        <Link
          href="/all-books"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#285b48] hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to all books
        </Link>
      </div>
    </main>
  );
}
