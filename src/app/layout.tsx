
import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BookNest | Your Home for Every Story",
    template: "%s | BookNest",
  },

  description:
    "Discover, share, and borrow books with BookNest. Explore our online library, add your favorite books, manage your collection, and enjoy a seamless book borrowing experience.",

  applicationName: "BookNest",

  keywords: [
    "BookNest",
    "BookNest Library",
    "Online Library",
    "Library Management System",
    "Book Sharing Platform",
    "Borrow Books Online",
    "Book Collection",
    "Add Books",
    "Discover Books",
    "Digital Library",
    "Book Borrowing System",
  ],

  openGraph: {
    title: "BookNest | Your Home for Every Story",
    description:
      "Explore, share, and borrow books with BookNest. Your modern online library for discovering stories and managing your favorite books.",
    siteName: "BookNest",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary",
    title: "BookNest | Your Home for Every Story",
    description:
      "Discover, share, and borrow books with BookNest — your modern online library.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "Books & Literature",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body
        className={`min-h-full flex flex-col ${fraunces.className}`}
      >
        {children}
      </body>
    </html>
  );
}
