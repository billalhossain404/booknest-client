"use client";

import type { FormEvent } from "react";

import { BookOpen, Layers3, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

import { CheckCircle2, XCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type BookingCardProps = {
  book: {
    _id?: string;
    title?: string;
    author?: string;
    availableCopies?: number;
    totalCopies?: number;
    copies?: number;
    sharedBy?: string;
    ownerName?: string;
    owner?: string;
  };
};

// Reusable Info Item
function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e5eadb] text-[#275747]">
        <Icon className="size-5" strokeWidth={1.7} />
      </span>

      <div className="min-w-0">
        <p className="text-xs text-[#68736b]">{label}</p>

        <p className="truncate text-sm font-semibold text-[#213b31]">{value}</p>
      </div>
    </div>
  );
}

// Booking Card Component
const BookingCard = ({ book }: BookingCardProps) => {
  const [popup, setPopup] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const { data: session } = authClient.useSession();

  const user = session?.user;

  // Available Copies
  const availableCopies = book.availableCopies ?? book.copies ?? 3;

  const totalCopies = book.totalCopies ?? Math.max(availableCopies, 5);

  // Shared By
  const sharedBy =
    book.sharedBy || book.ownerName || book.owner || "BookNest member";

  // Handle Borrow
  const handleBorrow = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      console.log("Please sign in before borrowing.");
      return;
    }

    const data = {
      ...book,
      userName: user.name,
      userEmail: user.email,
      image: user.image,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/bookings`,
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      setPopup({
        open: true,
        type: "success",
        title: "Booking Successful!",
        message: "Your book has been successfully borrowed. Enjoy reading!",
      });
    } catch (error) {
      console.error("Booking error:", error);

      setPopup({
        open: true,
        type: "error",
        title: "Booking Failed!",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div>
      {/* Book Information */}
      <form onSubmit={handleBorrow} className="mt-7">
        <div className="grid gap-5 rounded-2xl border border-[#e4e6d9] bg-[#f7f7ef] p-5 sm:grid-cols-2 sm:gap-3">
          <InfoItem icon={UserRound} label="Shared by" value={sharedBy} />

          <InfoItem
            icon={Layers3}
            label="Available copies"
            value={`${availableCopies} of ${totalCopies}`}
          />
        </div>

        {/* Borrow Button */}
        <Button
          type="submit"
          className="mt-5 h-14 w-full rounded-xl bg-[#174b39] text-base font-semibold text-white shadow-sm hover:bg-[#123c2e]"
          disabled={availableCopies <= 0}
        >
          <BookOpen className="size-5" />

          {availableCopies > 0 ? "Borrow This Book" : "Currently unavailable"}

          {availableCopies > 0 && <span className="ml-2">→</span>}
        </Button>
      </form>

      {/* Success / Error Center Popup */}
      <Dialog
        open={popup.open}
        onOpenChange={(open) => setPopup((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-[380px] rounded-2xl border border-[#e5e7dc] bg-[#fffefa] p-7 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            {/* Popup Icon */}
            {popup.type === "success" ? (
              <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-[#e6f3e9]">
                <CheckCircle2 className="size-12 text-[#26834b]" />
              </div>
            ) : (
              <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-red-50">
                <XCircle className="size-12 text-red-500" />
              </div>
            )}

            {/* Popup Heading */}
            <DialogHeader className="items-center space-y-2">
              <DialogTitle
                className={`text-xl font-bold ${
                  popup.type === "success" ? "text-[#174b39]" : "text-red-600"
                }`}
              >
                {popup.title}
              </DialogTitle>

              <DialogDescription className="text-center text-sm leading-6 text-[#68736b]">
                {popup.message}
              </DialogDescription>
            </DialogHeader>

            {/* Close Button */}
            <Button
              type="button"
              onClick={() => setPopup((prev) => ({ ...prev, open: false }))}
              className={`mt-6 h-11 w-full rounded-xl font-semibold text-white ${
                popup.type === "success"
                  ? "bg-[#174b39] hover:bg-[#123c2e]"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {popup.type === "success" ? "Great, Thanks!" : "Try Again"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingCard;
