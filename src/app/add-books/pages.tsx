"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  ImagePlus,
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
  "Select category",
  "Fiction",
  "Non-fiction",
  "Mystery",
  "Romance",
  "Science fiction",
  "Biography",
];

export default function AddBookPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f7f7f3] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#e4e0d8] bg-[#fffdfa] shadow-[0_12px_35px_rgba(27,52,40,0.07)]"
      >
        <div className="px-5 pb-8 pt-7 sm:px-8 lg:px-10 lg:pt-9">
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
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleCoverChange}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex min-h-64 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#87ad9a] bg-[#f7faf6] px-4 text-center transition-colors hover:bg-[#eff7f0] lg:min-h-[292px]"
              >
                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview}
                      alt="Selected book cover preview"
                      className="absolute inset-0 h-full w-full object-cover"
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
                      Drag &amp; drop an image here, or
                      <br />
                      click to choose a file
                    </span>
                    <span className="mt-4 rounded-full bg-[#e6ece5] px-3 py-1 text-[10px] font-medium text-[#57635c]">
                      JPG, PNG (Max 5 MB)
                    </span>
                  </>
                )}
              </button>
              {fileName && (
                <p className="mt-2 truncate text-center text-xs text-[#5e6b63]">
                  {fileName}
                </p>
              )}
            </div>

            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
              <Field label="Book Title" required icon={<BookOpen />}>
                <Input
                  name="title"
                  required
                  placeholder="e.g. Atomic Habits"
                  className={fieldClass}
                />
              </Field>
              <Field label="Author" required icon={<UserRound />}>
                <Input
                  name="author"
                  required
                  placeholder="e.g. James Clear"
                  className={fieldClass}
                />
              </Field>
              <Field label="Category" required icon={<Tag />}>
                <select
                  name="category"
                  required
                  defaultValue=""
                  className={`${fieldClass} w-full appearance-none border-2 border-[#1f5a43] focus-visible:border-[#174936]`}
                >
                  <option value="" disabled className="bg-[#1f5a43] text-white">
                    Select category
                  </option>
                  {categories.slice(1).map((category) => (
                    <option key={category} className="bg-[#f5e4ba68] text-black">
                      {category}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Language" required icon={<Languages />}>
                <select
                  name="language"
                  defaultValue="English"
                  className={`${fieldClass} w-full appearance-none border-2 border-[#1f5a43] focus-visible:border-[#174936]`}
                >
                  <option className="bg-[#f5e4ba68] text-black">English</option>
                  <option className="bg-[#f5e4ba68] text-black">Bangla</option>
                  <option className="bg-[#f5e4ba68] text-black">Hindi</option>
                  <option className="bg-[#f5e4ba68] text-black">Other</option>
                </select>
              </Field>
              <Field label="Published Year" icon={<CalendarDays />}>
                <Input
                  name="publishedYear"
                  type="number"
                  min="0"
                  placeholder="e.g. 2018"
                  className={fieldClass}
                />
              </Field>
              <Field label="ISBN" optional icon={<BookOpen />}>
                <Input
                  name="isbn"
                  placeholder="e.g. 9781234567890"
                  className={fieldClass}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description" required icon={<BookOpen />}>
                  <textarea
                    name="description"
                    required
                    placeholder="Write a short description of the book..."
                    className="min-h-24 w-full resize-y rounded-lg border border-[#d9ddd8] bg-white/70 px-3 py-3 text-sm text-[#303b36] outline-none placeholder:text-[#89908b] focus:border-[#2d6a52] focus:ring-3 focus:ring-[#2d6a52]/20"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#eeeae2] px-5 py-5 sm:flex-row sm:justify-end sm:px-8 lg:px-10">
          <Button
            type="reset"
            variant="outline"
            onClick={() => {
              setCoverPreview(null);
              setFileName("");
            }}
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
      </form>
    </main>
  );
}

function Field({
  label,
  required = false,
  optional = false,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
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
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#65726b] [&_svg]:size-[17px]">
          {icon}
        </span>
        <span className="[&_input]:pl-10 [&_select]:pl-10">{children}</span>
      </span>
    </label>
  );
}
