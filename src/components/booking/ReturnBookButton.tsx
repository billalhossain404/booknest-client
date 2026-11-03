
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ReturnResult = {
  success: boolean;
  message: string;
};

type ReturnBookButtonProps = {
  bookingId: string;
  action: (formData: FormData) => Promise<ReturnResult>;
};

export default function ReturnBookButton({
  bookingId,
  action,
}: ReturnBookButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<ReturnResult>({
    success: false,
    message: "",
  });
  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(() => {
      setOpen(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [open]);

  const handleReturn = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("bookingId", bookingId);

      const response = await action(formData);

      setResult(response);
      setOpen(true);

    } catch (error) {
      console.error("Return error:", error);

      setResult({
        success: false,
        message: "Something went wrong. Please try again.",
      });

      setOpen(true);

    } finally {
      setLoading(false);
    }
  };

  const handleDialogChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    // Refresh after successful popup is closed
    if (!nextOpen && result.success) {
      router.refresh();
    }
  };

  return (
    <>
      {/* Return Button */}
      <Button
        type="button"
        onClick={handleReturn}
        disabled={loading}
        className="w-full rounded-md border border-[#c99c50] bg-transparent px-2 py-2 text-[10px] font-medium text-[#9a6a22] shadow-none hover:bg-[#fcf4e3] hover:text-[#9a6a22] sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="mr-1 size-3 animate-spin" />
            Returning...
          </>
        ) : (
          "Return Book"
        )}
      </Button>

      {/* Success / Error Popup */}
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="w-[calc(100%-32px)] max-w-[390px] rounded-2xl border-[#e5e3d8] bg-[#fffefa] p-7">

          <div className="flex flex-col items-center text-center">

            {/* Icon */}
            {result.success ? (
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#e4f1e5]">
                <CheckCircle2
                  className="size-9 text-[#39845f]"
                  strokeWidth={1.7}
                />
              </div>
            ) : (
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#fce8e5]">
                <XCircle
                  className="size-9 text-[#c65b50]"
                  strokeWidth={1.7}
                />
              </div>
            )}

            <DialogHeader className="items-center text-center">

              <DialogTitle className="font-serif text-2xl font-semibold text-[#173c2e]">
                {result.success
                  ? "Book Returned!"
                  : "Return Failed!"}
              </DialogTitle>

              <DialogDescription className="mt-2 text-sm leading-6 text-[#68736b]">
                {result.message}
              </DialogDescription>

            </DialogHeader>
            

            {/* Close Button */}
            <Button
              onClick={() => setOpen(false)}
              className={`mt-6 h-11 w-full rounded-xl font-medium text-white ${
                result.success
                  ? "bg-[#174b39] hover:bg-[#123c2e]"
                  : "bg-[#b95449] hover:bg-[#a44339]"
              }`}
            >
              {result.success ? "Great, Thank You!" : "Try Again"}
            </Button>

          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}
