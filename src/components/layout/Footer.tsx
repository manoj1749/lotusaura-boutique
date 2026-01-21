import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="font-display text-2xl font-bold">Lotus Aura</div>
          <p className="mt-3 text-sm text-neutral-400">
            Bringing the essence of traditional weaving to the contemporary wardrobe.
            <br />
            <span className="font-medium text-neutral-300">Label_by_Lotusaura</span>
          </p>
        </div>

        <div>
           <div className="text-xs font-bold uppercase tracking-widest text-primary">
            Shop
          </div>
          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            <li><Link href="/collections?sort=newest" className="hover:text-primary transition">New Arrivals</Link></li>
            <li><Link href="/collections?category=Sarees" className="hover:text-primary transition">Sarees</Link></li>
            <li><Link href="/collections?category=Lehengas" className="hover:text-primary transition">Lehengas</Link></li>
            <li><Link href="/collections?category=Suits" className="hover:text-primary transition">Suit Sets</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-primary">
            Information
          </div>
          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            <li><Link href="/#about" className="hover:text-primary transition">About Us</Link></li>
            <li><Link href="#" className="hover:text-primary transition">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-primary transition">Shipping Policy</Link></li>
            <li><Link href="#" className="hover:text-primary transition">Returns & Exchange</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-primary">
            Contact Us
          </div>
          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Mumbai, Maharashtra, India</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@lotusaura.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Lotus Aura. All rights reserved.
      </div>
    </footer>
  );
}
