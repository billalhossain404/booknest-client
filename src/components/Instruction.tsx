import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Heart,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "1",
    title: "Join the community",
    description: "Create a free account and become part of a local network of book lovers.",
    icon: UsersRound,
  },
  {
    number: "2",
    title: "Find and borrow",
    description: "Browse available books from people near you and request to borrow.",
    icon: BookOpen,
  },
  {
    number: "3",
    title: "Read and share",
    description: "Enjoy the book, return it, and keep the stories moving.",
    icon: Heart,
  },
];

const Instruction = () => {
  return (
    <section className="border-y border-[#ece9df] bg-[#fbfaf5] px-7 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-[72px]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-xl">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[#ad7a2c]">
            Simple steps
          </span>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#12352b] sm:text-4xl">
            How it works
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#64716a] sm:text-base">
            Getting started is simple. More books in more hands.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center lg:gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="contents">
                <Card className="rounded-2xl border border-[#ebe9dc] bg-white/45 p-0 shadow-[0_6px_20px_rgba(27,65,48,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d8d8c6] hover:bg-white/75 hover:shadow-[0_10px_24px_rgba(27,65,48,0.07)]">
                  <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#e9e9d8] text-[#173c31] sm:size-[68px]">
                      <Icon className="size-7" strokeWidth={1.5} />
                    </div>

                    <div className="min-w-0 pt-0.5">
                      <span className="font-serif text-base font-semibold text-[#ad7a2c]">
                        {step.number}
                      </span>
                      <h3 className="mt-0.5 font-serif text-lg font-semibold leading-tight text-[#173c31] sm:text-xl">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 max-w-xs text-xs leading-5 text-[#59635e] sm:text-sm">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {index < steps.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="mx-auto hidden size-6 text-[#b07a2a] lg:block"
                    strokeWidth={1.4}
                  />
                )}
              </div>
            );
          })}
        </div>

        <Card className="relative mt-10 overflow-hidden rounded-2xl border-0 bg-[#18523e] p-0 text-white shadow-[0_14px_35px_rgba(24,82,62,0.16)] sm:mt-14">
          <div className="pointer-events-none absolute -left-3 -top-8 text-[#4c8067]/40">
            <svg width="150" height="180" viewBox="0 0 150 180" fill="none" aria-hidden="true">
              <path d="M92 180C73 139 62 94 77 17M77 98C49 92 25 72 12 45M73 122C45 127 22 143 7 166M76 67C97 54 111 34 117 9" stroke="currentColor" strokeWidth="2" />
              <path d="M50 91C34 89 21 78 13 63C29 64 42 73 50 91ZM44 127C28 130 17 141 8 155C25 153 38 144 44 127ZM88 56C99 44 109 30 113 15C98 25 90 39 88 56Z" fill="currentColor" />
            </svg>
          </div>
          <div className="pointer-events-none absolute -bottom-10 -right-4 rotate-12 text-[#4c8067]/40">
            <svg width="150" height="180" viewBox="0 0 150 180" fill="none" aria-hidden="true">
              <path d="M58 180C76 135 83 90 70 15M70 97C98 90 121 70 133 43M76 123C104 127 128 143 143 165M72 66C52 53 39 34 33 9" stroke="currentColor" strokeWidth="2" />
              <path d="M96 90C112 87 125 76 133 61C117 62 104 72 96 90ZM105 127C121 130 133 141 142 154C125 152 112 143 105 127ZM62 56C51 44 41 30 37 15C52 25 60 39 62 56Z" fill="currentColor" />
            </svg>
          </div>

          <CardContent className="relative z-10 flex flex-col gap-6 px-6 py-7 sm:px-10 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-9 lg:px-16">
            <h2 className="max-w-md font-serif text-2xl font-semibold leading-tight sm:text-3xl">
              A more connected world through better books.
            </h2>

            <div className="hidden h-14 w-px bg-[#8eaa99] lg:block" />

            <p className="max-w-sm text-xs leading-5 text-[#e2ece6] sm:text-sm sm:leading-6">
              Join BookNest and be part of a community that keeps great stories
              in circulation.
            </p>

            <Button
              render={<Link href="/sign-up" />}
              className="h-11 w-full rounded-lg bg-[#d79c45] px-5 text-sm text-white shadow-sm hover:bg-[#c58c38] sm:w-fit"
            >
              Join the library
              <ArrowRight className="size-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Instruction;
