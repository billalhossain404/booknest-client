"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/images/banner1.png",
    alt: "A stack of books on a wooden table",
    subtitle: "Your next chapter starts here",
    title1: "Great stories.",
    title2: "Shared together.",
    description:
      "BookNest is a community library where people borrow, share and discover books. Different shelves, brighter conversations, a kinder world — one book at a time.",
    buttonText: "Browse Books",
    buttonLink: "/books",
  },
  {
    image: "/images/banner2.png",
    alt: "The Secret Garden and nature books",
    subtitle: "Explore a world of knowledge",
    title1: "Discover more.",
    title2: "Read beyond.",
    description:
      "From timeless classics to exciting new discoveries, explore a collection of books that inspire curiosity, spark imagination and make every reading moment meaningful.",
    buttonText: "Explore Collection",
    buttonLink: "/books",
  },
  {
    image: "/images/banner3.png",
    alt: "A bright library reading room",
    subtitle: "A library without boundaries",
    title1: "Borrow books.",
    title2: "Grow ideas.",
    description:
      "Your next favorite book is closer than you think. Discover available books, borrow from fellow readers and enjoy a simple, connected library experience with BookNest.",
    buttonText: "Start Borrowing",
    buttonLink: "/books",
  },
  {
    image: "/images/banner4.png",
    alt: "A quiet library aisle with bookshelves",
    subtitle: "Every book deserves a reader",
    title1: "Share a book.",
    title2: "Spark a story.",
    description:
      "Have books sitting on your shelf? Give them a new purpose. Add your books to BookNest, share them with the community and help more readers discover something wonderful.",
    buttonText: "Share Your Books",
    buttonLink: "/books/new",
  },
  {
    image: "/images/banner5.png",
    alt: "Open books and reading accessories",
    subtitle: "Your personal reading space",
    title1: "Your books.",
    title2: "Your journey.",
    description:
      "Keep your reading experience organized in one beautiful place. Easily manage your borrowed books, explore your collection and stay connected with your growing library.",
    buttonText: "My Borrowed Books",
    buttonLink: "/my-borrows",
  },
];

const Banner = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const showSlide = (slide: number) => {
    setActiveSlide((slide + slides.length) % slides.length);
  };

  return (
    <section
      aria-label="BookNest highlights"
      className="relative overflow-hidden border-b border-[#EAE6DC] bg-[#FAF9F5]"
    >
      <div className="relative flex min-h-[620px] w-full items-center px-6 py-16 lg:min-h-[590px]">

        {slides.map((slide, index) => (
          <Image
            key={slide.image}
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            className={`object-cover object-[62%_center] transition-opacity duration-700 ${
              activeSlide === index
                ? "opacity-100"
                : "opacity-0"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px"
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F5] via-[#FAF9F5]/95 to-transparent lg:via-[#FAF9F5]/75" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center">

          <div className="grid w-full max-w-xl">

            {slides.map((slide, index) => (
              <div
                key={slide.image}
                aria-hidden={activeSlide !== index}
                className={`col-start-1 row-start-1 transition-all duration-700 ease-in-out ${
                  activeSlide === index
                    ? "visible translate-y-0 opacity-100"
                    : "invisible pointer-events-none translate-y-3 opacity-0"
                }`}
              >

                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-[#B18B4F] sm:text-sm">
                  {slide.subtitle}
                </p>

                <h1 className="max-w-lg text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-[#234D3C] sm:text-6xl lg:text-7xl">
                  {slide.title1}
                  <br />
                  {slide.title2}
                </h1>

                <p className="mt-7 max-w-md text-base leading-7 text-[#535B53] sm:text-lg">
                  {slide.description}
                </p>

                <Link
                  href={slide.buttonLink}
                  tabIndex={activeSlide === index ? 0 : -1}
                  className="mt-8 inline-flex items-center gap-3 rounded-md bg-[#234D3C] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#18382C]"
                >
                  {slide.buttonText}
                  <ArrowRight className="h-5 w-5" />
                </Link>

              </div>
            ))}

          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 z-10 flex w-full max-w-7xl -translate-x-1/2 items-center justify-end gap-3 px-6">

          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => showSlide(activeSlide - 1)}
            className="rounded-full border border-[#234D3C]/25 bg-[#FAF9F5]/80 p-2 text-[#234D3C] transition-colors hover:bg-[#234D3C] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div
            className="flex items-center gap-2"
            aria-label="Slide navigation"
          >
            {slides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={activeSlide === index}
                onClick={() => showSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === index
                    ? "w-6 bg-[#234D3C]"
                    : "w-2 bg-[#234D3C]/35 hover:bg-[#234D3C]/65"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next slide"
            onClick={() => showSlide(activeSlide + 1)}
            className="rounded-full border border-[#234D3C]/25 bg-[#FAF9F5]/80 p-2 text-[#234D3C] transition-colors hover:bg-[#234D3C] hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

        </div>

      </div>
    </section>
  );
};

export default Banner;
