import Link from "next/link";
import { IconBook } from "@tabler/icons-react";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

const contactItems = [
  { icon: Mail, label: "info.billalhossain001.com" },
  { icon: Phone, label: "+8801846918599" },
  { icon: MapPin, label: "Dhaka, Bangladesh" },
];

const socialLinks = [
  { label: "YouTube", href: "https://www.youtube.com/@billalhossainoo", icon: FaYoutube },
  { label: "Facebook", href: "https://www.facebook.com/ibillalhossain", icon: FaFacebookF },
  { label: "Instagram", href: "https://www.instagram.com/billal__404", icon: FaInstagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/billalhossainexe/", icon: FaLinkedinIn },
];

export default function Footer() {
  return (

    
    <footer className="relative overflow-hidden bg-[#faf9f5] text-[#122b22]">
      <div className="pointer-events-none absolute -left-16 bottom-28 hidden h-36 w-36 rounded-full border-[18px] border-[#dcebd8] opacity-60 sm:block" />
      <div className="pointer-events-none absolute -right-20 top-8 hidden h-56 w-56 rounded-full border-[16px] border-[#eee2c9] opacity-70 md:block" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_0.85fr_1.2fr] lg:gap-16 lg:px-10 lg:pt-20">
        <section>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-[45%] border-2 border-[#174c3a] text-3xl text-[#174c3a]">
              <IconBook size={34} stroke={1.5} />
            </span>
            <span className="text-4xl font-semibold tracking-tight text-[#174c3a]">
              Book<span className="text-[#b8872d]">Nest</span>
            </span>
          </Link>
          <div className="mt-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-[#174c3a]">
            <span className="h-px w-10 bg-[#c6953b]" />
            Your home for every story
            <span className="h-px w-10 bg-[#c6953b]" />
          </div>
          <p className="mt-7 max-w-md text-base leading-7 text-[#42504a] sm:text-lg">
            A digital library to discover, borrow, and share your favorite
            books. Read, learn, and grow with BookNest.
          </p>
        </section>

        <section className="lg:border-l lg:border-[#d8d1c4] lg:pl-12">
          <h2 className="font-serif text-3xl font-semibold text-[#12372a]">
            Get in Touch
          </h2>
          <div className="mt-7 space-y-4">
            {contactItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e2f0df] text-[#174c3a]">
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <span className="text-base text-[#303b36] sm:text-lg">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:border-l lg:border-[#d8d1c4] lg:pl-12">
          <h2 className="font-serif text-3xl font-semibold text-[#12372a]">
            Stay Updated
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#42504a] sm:text-lg">
            Subscribe to get the latest book additions, features, and library
            updates.
          </p>
          <form className="mt-7 flex max-w-xl overflow-hidden rounded-2xl border border-[#cfcfc9] bg-white shadow-sm">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <Mail
              aria-hidden="true"
              size={22}
              className="my-auto ml-5 shrink-0 text-[#263b34]"
            />
            <input
              id="footer-email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-transparent px-4 py-4 text-base text-[#263b34] outline-none placeholder:text-[#727875]"
            />
            <button
              type="submit"
              className="m-1 rounded-xl bg-[#174c3a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f3a2c] sm:px-8 sm:text-base"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>

      <div className="relative bg-[#123f30] text-white before:absolute before:-top-8 before:left-[-5%] before:h-16 before:w-[110%] before:rounded-[50%] before:border-t-[5px] before:border-[#c6953b] before:bg-[#123f30]">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-7 px-5 pb-7 pt-12 sm:px-8 lg:flex-row lg:justify-between lg:px-10">
          <p className="text-center text-sm text-white/90 sm:text-base lg:text-left">
            © 2026 BookNest. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white transition-colors hover:bg-[#c6953b]"
              >
                <Icon size={21} />
              </Link>
            ))}
          </div>

          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-white/90 sm:text-base">
            <Link href="/privacy-policy" className="hover:text-[#e8c77d]">
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-white/50">
              |
            </span>
            <Link href="/terms-of-service" className="hover:text-[#e8c77d]">
              Terms of Service
            </Link>
            <span aria-hidden="true" className="text-white/50">
              |
            </span>
            <Link href="/contact" className="hover:text-[#e8c77d]">
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}