import Link from "next/link";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import type { SiteSettings } from "@/types/site-settings";

function getInstagramHandle(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/^\/|\/$/g, "");
    return path ? `@${path}` : url;
  } catch {
    return url;
  }
}

export function Footer({ siteSettings }: { siteSettings?: SiteSettings }) {
  const igUrl = siteSettings?.instagramUrl ?? "https://www.instagram.com/lavanya_salluri___";
  const igHandle = getInstagramHandle(igUrl);
  const address = siteSettings?.address ?? "Mancherial, Near TTD Kalyana Mandapam, India";
  const contactNumber = siteSettings?.contactNumber ?? "+91 91210 63268";
  const email = siteSettings?.email ?? "hello@lotusaura.com";
  return (
    <footer className="w-full bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="font-display text-2xl font-bold">Harshini Designer Studio</div>

          <p className="mt-3 text-sm text-background/70">
            Bringing the essence of traditional weaving to the contemporary wardrobe.
          </p>

          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-background/80 transition-colors"
            aria-label={`Open Instagram: ${igHandle}`}
          >
            <Instagram className="h-4 w-4" />
            {igHandle}
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
              <MapPin className="h-4 w-4" /> {address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> {contactNumber}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${email}`} className="hover:underline transition-colors">{email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full border-t border-background/15 py-6 text-center text-xs text-background/60">
        © {new Date().getFullYear()} Harshini Designer Studio. All rights reserved.
      </div>
    </footer>
  );
}