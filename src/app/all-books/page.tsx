import AllBooksView, { type Book } from "@/components/AllBooksView";

type BooksResponse = {
  success: boolean;
  books?: Book[];
  message?: string;
};

const API_URL = "http://localhost:8000/all-books";

export default async function AllBooksPage() {
  let books: Book[] = [];
  let errorMessage = "";

  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    const data = (await response.json()) as BooksResponse;

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to load books.");
    }

    books = Array.isArray(data.books) ? data.books : [];
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unable to load books.";
  }

  return <AllBooksView books={books} errorMessage={errorMessage} />;
}
