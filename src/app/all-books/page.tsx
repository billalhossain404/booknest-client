import AllBooksView, { type Book } from "@/components/AllBooksView";

type BooksResponse = {
  success: boolean;
  books?: Book[];
  message?: string;
};

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/all-books`;

export default async function AllBooksPage() {
  let books: Book[] = [];
  let errorMessage = "";

  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    const data = (await response.json()) as BooksResponse;

    console.log("Fetched data:", data); // Debugging line
    console.log("Response status:", response); // Debugging line
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
