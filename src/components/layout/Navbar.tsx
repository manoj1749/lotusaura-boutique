"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";


import { CartButton } from "@/components/cart/CartButton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface NavbarProps {
  whatsappNumber?: string;
}

export function Navbar({ whatsappNumber = WHATSAPP_NUMBER }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu & Brand (Grouped for alignment on mobile) */}
          <div className="flex items-center gap-4 md:hidden">
             <Sheet>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="-ml-2">
                   <Menu className="h-6 w-6" />
                   <span className="sr-only">Open menu</span>
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                 <nav className="flex flex-col gap-6 mt-10">
                    <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                      Home
                    </Link>
                    <Link href="/collections" className="text-lg font-medium hover:text-primary transition-colors">
                      Collections
                    </Link>
                    <Link href="/#about" className="text-lg font-medium hover:text-primary transition-colors">
                      About Us
                    </Link>
                    <div className="h-px bg-border my-2" />
                    <a
                      className="flex items-center gap-2 text-green-600 font-medium"
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Chat on WhatsApp
                    </a>
                 </nav>
               </SheetContent>
             </Sheet>
          </div>

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group mr-auto md:mr-0">
            <div className="relative h-10 w-10 flex-shrink-0">
               <Image 
                 src="/lotusaura.png" 
                 alt="Lotus Aura" 
                 fill
                 className="rounded-full object-cover border border-primary/20 shadow-sm"
               />
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

          {/* Desktop Links */}
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
