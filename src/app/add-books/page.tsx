"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { CheckCircle2 } from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import Image from "next/image";

import {
  BookOpen,
  CalendarDays,
  ImagePlus,
  Link2,
  Languages,
  Plus,
  Tag,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fieldClass =
  "h-11 rounded-lg border-[#d9ddd8] bg-white/70 px-3 text-sm text-[#303b36] shadow-none placeholder:text-[#89908b] focus-visible:border-[#2d6a52] focus-visible:ring-[#2d6a52]/20";

const categories = [
  "Fiction",
  "Non-fiction",
  "Mystery",
  "Romance",
  "Science fiction",
  "Biography",
];

const initialForm = {
  title: "",
  author: "",
  category: "",
  language: "English",
  publishedYear: "",
  isbn: "",
  bookUrl: "",
  description: "",
};

type BookForm = typeof initialForm;

export default function AddBookPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<BookForm>(initialForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverError, setCoverError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const update = (field: keyof BookForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSubmitMessage("");
  };

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setCoverError("Please upload a JPG or PNG image.");
      event.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setCoverError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setCoverError("");
    setSubmitMessage("");
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleReset = () => {
    setForm({ ...initialForm });
    setCoverFile(null);
    setCoverPreview(null);
    setCoverError("");
    setSubmitMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/add-books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add book");
      }

      handleReset();
      setSuccessOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setSubmitMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f7f7f3] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#e4e0d8] bg-[#fffdfa] shadow-[0_12px_35px_rgba(27,52,40,0.07)]"
      >
        <div className="px-5 pb-8 pt-7 sm:px-8 lg:px-10 lg:pt-9">
          {/* Page Header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1f5a43] text-white shadow-sm sm:h-14 sm:w-14">
              <BookOpen size={29} strokeWidth={1.7} />
              <Plus className="-ml-2 mt-5" size={16} strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-[#26342e] sm:text-3xl">
                Add New Book
              </h1>

              <p className="mt-1 text-sm text-[#646c67] sm:text-base">
                Fill in the details below to add a book to the library.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[185px_1fr] lg:gap-10">
            {/* Book Cover Upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleCoverChange}
                className="sr-only"
                aria-label="Upload book cover"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex min-h-64 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#87ad9a] bg-[#f7faf6] px-4 text-center transition-colors hover:bg-[#eff7f0] lg:min-h-[292px]"
              >
                {coverPreview ? (
                  <>
                    <Image
                      src={coverPreview}
                      alt="Selected book cover preview"
                      fill
                      unoptimized
                      sizes="185px"
                      className="object-cover"
                    />

                    <span className="absolute inset-x-3 bottom-3 rounded-lg bg-[#123f30]/85 px-2 py-2 text-xs font-medium text-white">
                      Change cover
                    </span>
                  </>
                ) : (
                  <>
                    <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#5c8b73] text-[#5c8b73]">
                      <ImagePlus size={29} strokeWidth={1.7} />
                    </span>

                    <span className="text-sm font-bold text-[#27352e]">
                      Upload Book Cover
                    </span>

                    <span className="mt-2 text-xs leading-5 text-[#6d756f]">
                      Click to choose a file
                      <br />
                      JPG or PNG image
                    </span>

                    <span className="mt-4 rounded-full bg-[#e6ece5] px-3 py-1 text-[10px] font-medium text-[#57635c]">
                      JPG, PNG (Max 5 MB)
                    </span>
                  </>
                )}
              </button>

              {coverFile && (
                <p className="mt-2 truncate text-center text-xs text-[#5e6b63]">
                  {coverFile.name}
                </p>
              )}

              {coverError && (
                <p
                  role="alert"
                  className="mt-2 text-center text-xs text-red-500"
                >
                  {coverError}
                </p>
              )}
            </div>

            {/* Book Details */}
            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
              {/* Title */}
              <Field label="Book Title" required icon={<BookOpen />}>
                <Input
                  name="title"
                  required
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Atomic Habits"
                  className={fieldClass}
                />
              </Field>

              {/* Author */}
              <Field label="Author" required icon={<UserRound />}>
                <Input
                  name="author"
                  required
                  value={form.author}
                  onChange={(e) => update("author", e.target.value)}
                  placeholder="e.g. James Clear"
                  className={fieldClass}
                />
              </Field>

              {/* Category */}
              <Field label="Category" required icon={<Tag />}>
                <select
                  name="category"
                  required
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className={`${fieldClass} w-full appearance-none border-2 border-[#1f5a43] focus-visible:border-[#174936]`}
                >
                  <option value="" disabled>
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-[#fffdfa] text-black"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Language */}
              <Field label="Language" required icon={<Languages />}>
                <select
                  name="language"
                  required
                  value={form.language}
                  onChange={(e) => update("language", e.target.value)}
                  className={`${fieldClass} w-full appearance-none border-2 border-[#1f5a43] focus-visible:border-[#174936]`}
                >
                  {["English", "Bangla", "Hindi", "Other"].map((language) => (
                    <option
                      key={language}
                      value={language}
                      className="bg-[#fffdfa] text-black"
                    >
                      {language}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Published Year */}
              <Field label="Published Year" icon={<CalendarDays />}>
                <Input
                  name="publishedYear"
                  type="number"
                  min="0"
                  value={form.publishedYear}
                  onChange={(e) => update("publishedYear", e.target.value)}
                  placeholder="e.g. 2018"
                  className={fieldClass}
                />
              </Field>

              {/* ISBN */}
              <Field label="ISBN" optional icon={<BookOpen />}>
                <Input
                  name="isbn"
                  value={form.isbn}
                  onChange={(e) => update("isbn", e.target.value)}
                  placeholder="e.g. 9781234567890"
                  className={fieldClass}
                />
              </Field>

              {/* Book URL */}
              <div className="sm:col-span-2">
                <Field label="Book URL" required icon={<Link2 />}>
                  <Input
                    name="bookUrl"
                    type="url"
                    required
                    value={form.bookUrl}
                    onChange={(e) => update("bookUrl", e.target.value)}
                    placeholder="https://example.com/book"
                    className={fieldClass}
                  />
                </Field>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <Field
                  label="Description"
                  required
                  multiline
                  icon={<BookOpen />}
                >
                  <textarea
                    name="description"
                    required
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Write a short description of the book..."
                    className="min-h-24 w-full resize-y rounded-lg border border-[#d9ddd8] bg-white/70 px-3 py-3 text-sm text-[#303b36] outline-none placeholder:text-[#89908b] focus:border-[#2d6a52] focus:ring-3 focus:ring-[#2d6a52]/20"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#eeeae2] px-5 py-5 sm:flex-row sm:justify-end sm:px-8 lg:px-10">
          <Button
            type="reset"
            variant="outline"
            className="h-11 border-[#9ba49e] px-6 text-[#34423b] hover:bg-[#f1f3ee]"
          >
            <X size={18} />
            Cancel
          </Button>

          <Button
            type="submit"
            className="h-11 bg-[#1f5a43] px-7 text-white hover:bg-[#174936]"
          >
            <Plus size={19} />
            Add Book
          </Button>
        </div>

        {submitMessage && (
          <p
            role="status"
            className="px-5 pb-5 text-center text-sm text-[#1f5a43] sm:px-8"
          >
            {submitMessage}
          </p>
        )}
      </form>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-[390px] rounded-2xl border-[#EAE6DC] bg-[#FAF9F5] p-8 text-center shadow-2xl">
          <DialogHeader className="flex flex-col items-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#E5F1E9]">
              <CheckCircle2
                size={46}
                strokeWidth={1.8}
                className="text-[#234D3C]"
              />
            </div>

            <DialogTitle className="font-serif text-2xl font-bold text-[#234D3C]">
              Book Added Successfully!
            </DialogTitle>

            <DialogDescription className="mt-3 text-center text-sm leading-relaxed text-[#72786F]">
              Your book has been successfully added to the BookNook library.
              Happy reading!
            </DialogDescription>
          </DialogHeader>

          <Button
            onClick={() => setSuccessOpen(false)}
            className="mt-6 h-11 w-full rounded-lg bg-[#234D3C] font-medium text-white transition-all hover:bg-[#183F32]"
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </main>
  );
}

/* Reusable Field Component */

function Field({
  label,
  required = false,
  optional = false,
  multiline = false,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-sm font-semibold text-[#28362f]">
        {label}

        {required && <span className="text-[#d84b39]">*</span>}

        {optional && (
          <span className="font-normal text-[#777e79]">(Optional)</span>
        )}
      </span>

      <span className="relative block">
        <span
          className={`pointer-events-none absolute left-3 z-10 text-[#65726b] [&_svg]:size-[17px] ${
            multiline ? "top-4" : "top-1/2 -translate-y-1/2"
          }`}
        >
          {icon}
        </span>

        <span className="block [&_input]:pl-10 [&_select]:pl-10 [&_textarea]:pl-10">
          {children}
        </span>
      </span>
    </label>
  );
}
