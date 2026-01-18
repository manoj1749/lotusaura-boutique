"use client";

import Link from "next/link";
import { Flower2, MessageCircle } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { CartButton } from "@/components/cart/CartButton";
import { Button } from "@/components/ui/button";

import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface NavbarProps {
  whatsappNumber?: string;
}

export function Navbar({ whatsappNumber = WHATSAPP_NUMBER }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-full border border-primary/50 bg-gradient-to-br from-secondary/60 to-background dark:to-background shadow-inner flex items-center justify-center group-hover:shadow-md transition-all">
              <Flower2 className="h-5 w-5 text-primary" />
            </div>

            <div>
              <div className="font-display text-xl sm:text-2xl font-bold tracking-wide">
                Lotus Aura
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary">
                Crafted For Her
              </div>
            </div>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              className="text-sm uppercase tracking-widest font-semibold hover:text-primary transition-colors" 
              href="/"
            >
              Home
            </Link>
            <Link 
              className="text-sm uppercase tracking-widest font-semibold hover:text-primary transition-colors" 
              href="/collections"
            >
              Collections
            </Link>
            <Link 
              className="text-sm uppercase tracking-widest font-semibold hover:text-primary transition-colors" 
              href="/#about"
            >
              About Us
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            
            <CartButton />
            
            <a
              className="hidden lg:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition"
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="text-lg"><MessageCircle className="h-5 w-5" /></span>
              <span className="text-xs font-bold uppercase tracking-wide">
                Chat
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
