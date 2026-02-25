import Link from "next/link";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="font-display text-2xl font-bold">Lotus Aura</div>

          <p className="mt-3 text-sm text-background/70">
            Bringing the essence of traditional weaving to the contemporary wardrobe.
          </p>

          <a
            href="https://www.instagram.com/label_by_lotusaura"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-background/80 transition-colors"
            aria-label="Open Instagram: @label_by_lotusaura"
          >
            <Instagram className="h-4 w-4" />
            @label_by_lotusaura
          </a>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#B56576] transition-colors">
            Shop
          </div>
          <ul className="mt-4 space-y-2 text-sm text-background/80">
            <li>
              <Link
                href="/collections?sort=newest"
                prefetch={false}
                className="transition-colors"
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link
                href="/collections?category=Sarees"
                prefetch={false}
                className="transition-colors"
              >
                Sarees
              </Link>
            </li>
            <li>
              <Link
                href="/collections?category=Lehengas"
                prefetch={false}
                className="transition-colors"
              >
                Lehengas
              </Link>
            </li>
            <li>
              <Link
                href="/collections?category=Suits"
                prefetch={false}
                className="transition-colors"
              >
                Suit Sets
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#B56576] transition-colors">
            Information
          </div>
          <ul className="mt-4 space-y-2 text-sm text-background/80">
            <li>
              <Link href="/#about" className="transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors">
                Returns & Exchange
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#B56576] transition-colors">
            Contact Us
          </div>
          <ul className="mt-4 space-y-2 text-sm text-background/80">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Mancherial, Near TTD Kalyana Mandapam, India
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +91 91210 63268
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> hello@lotusaura.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/15 py-6 text-center text-xs text-background/60">
        © {new Date().getFullYear()} Lotus Aura. All rights reserved.
      </div>
    </footer>
  );
}