"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { WhatsApp } from "@/components/icons/WhatsApp";
import { ModeToggle } from "@/components/mode-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";



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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2 md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/collections">Collections</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#about">About Us</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="p-0">
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      mx-2 mb-2 flex items-center justify-center gap-2
                      rounded-lg bg-green-600 px-4 py-3
                      text-white font-semibold
                      hover:bg-green-700
                      transition
                    "
                  >
                    <WhatsApp className="h-5 w-5 fill-white" />
                    Chat on WhatsApp
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* <Sheet>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="-ml-2">
                   <Menu className="h-6 w-6" />
                   <span className="sr-only">Open menu</span>
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="w-full max-w-none p-0">
                  <div className="h-full flex flex-col pt-12"> */}
                    {/* Menu 
                    <nav className="px-6 flex flex-col gap-2">
                      <Link
                        href="/"
                        className="w-full rounded-xl px-4 py-4 text-lg font-medium hover:bg-muted transition-colors"
                      >
                        Home
                      </Link>

                      <Link
                        href="/collections"
                        className="w-full rounded-xl px-4 py-4 text-lg font-medium hover:bg-muted transition-colors"
                      >
                        Collections
                      </Link>

                      <Link
                        href="/#about"
                        className="w-full rounded-xl px-4 py-4 text-lg font-medium hover:bg-muted transition-colors"
                      >
                        About Us
                      </Link>
                    </nav> */}

                    {/* Divider 
                    <div className="px-6">
                      <div className="h-px bg-border my-6" />
                    </div> */}

                    {/* Bottom CTA 
                    <div className="mt-auto px-6 pb-8">
                      <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 rounded-full bg-green-600 text-white py-4 font-semibold shadow-sm active:scale-[0.99] transition"
                      >
                        <WhatsApp className="h-5 w-5 fill-current" />
                        Chat on WhatsApp
                      </a>
                    </div> 
                  </div>
                </SheetContent>
             </Sheet> */}
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
              <span className="text-lg"><WhatsApp className="h-5 w-5 fill-current" /></span>
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
