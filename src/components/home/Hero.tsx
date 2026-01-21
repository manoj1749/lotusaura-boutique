import Link from "next/link";
import Image from "next/image";

import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface HeroProps {
  whatsappNumber?: string;
}

export function Hero({ whatsappNumber = WHATSAPP_NUMBER }: HeroProps) {
  return (
    <header className="relative w-full h-[600px] md:h-[750px] overflow-hidden">
      <div className="absolute inset-0 bg-[#FFF0F5] dark:bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-200/40 via-transparent to-transparent dark:from-rose-900/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] from-rose-50 via-rose-50/80 to-transparent dark:from-background dark:via-background/80" />
      </div>

      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="max-w-xl space-y-6">
          <span className="inline-block py-1 px-3 border border-primary text-primary uppercase text-[10px] tracking-[0.3em] bg-secondary/40 text-secondary-foreground backdrop-blur-md rounded-sm">
            New Arrivals
          </span>

          <h1 className="font-display text-5xl md:text-7xl leading-tight">
            Where <span className="italic text-primary">Lotus Aura</span>,<br />
            Becomes Fashion.
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-md border-l-4 border-primary pl-4">
            Unique. Modern. Classy designs.
            Crafted for Her.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/collections"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-sm uppercase tracking-widest text-xs font-bold shadow-lg hover:shadow-xl transition"
            >
              View Collection
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="bg-secondary/80 dark:bg-secondary/70 border border-white/60 dark:border-white/10 text-foreground hover:bg-secondary dark:hover:bg-secondary px-8 py-3 rounded-sm uppercase tracking-widest text-xs font-bold backdrop-blur-sm transition"
            >
              DM to design your perfect look
            </a>
          </div>
        </div>
      </div>
      
      {/* Hero Image */}
      {/* Hero Image */}
      {/* Hero Image */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-end justify-center">
        <div className="relative w-full h-[90%] md:w-[70%] md:h-full">
          <Image
            src="/hero-saree-woman-white-bg.png"
            alt="Graceful woman in traditional silk saree"
            fill
            className="object-contain object-bottom mix-blend-multiply opacity-90"
            priority
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
            }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
          />
        </div>
      </div>
    </header>
  );
}
