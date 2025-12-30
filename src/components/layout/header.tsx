import Link from 'next/link';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { Facebook, Instagram, Linkedin, X, Youtube } from 'lucide-react';
import Image from "next/image";

export default function Header() {
  return (
    <>
      {/* ================= Top Info Bar ================= */}
      <div className="sticky top-0 z-50 w-full">

        <div className="w-full bg-black text-white text-sm">
          <div className="container flex h-11 items-center">
            {/* Right Social Icons */}
            <div className="ml-auto flex items-center gap-3">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: X, label: "X (Twitter)" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }, i) => (
                <Link
                  key={i}
                  href="#"
                  aria-label={label}
                  className="
                    flex h-7 w-7 items-center justify-center rounded-full
                    text-white
                    hover:bg-white/10
                    transition
                  "
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ================= Main Navbar ================= */}
        <header
          className="
            top-0 z-40 w-full
            border-b border-black/5
            bg-gradient-to-b from-white via-white/95 to-white/90
            backdrop-blur-md
            shadow-[0_6px_20px_rgba(0,0,0,0.05)]
          "
        >
          <div className="container flex h-16 md:h-20 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/uploads/logo.png"
                alt="Riva Agro Exports"
                width={170}
                height={56}
                priority
                className="h-9 md:h-24 w-auto object-contain"
              />
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <MainNav className="hidden" />
              <UserNav />
            </div>

          </div>
        </header>

      </div>
    </>
  );
}