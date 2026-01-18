import Link from "next/link";

import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface HeroProps {
  whatsappNumber?: string;
}

export function Hero({ whatsappNumber = WHATSAPP_NUMBER }: HeroProps) {
  return (
    <header className="relative w-full h-[600px] md:h-[750px] overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDipmNDa3KcKVBXPqEM-hy4fv2-uStLeOXoqyxcWhRaIgd3zy96u9MWtP-YblHswkY_vWGB6cCCeIiahMIkMHrgTMlvJhkhy34IvdyPQVgkJcSDsitgohjfml6rAWPSHuzfybN9V-jDm0YGNZdEOHASpD0bA6pzKJZWo-304MEPD8RnbX6YOgxZcJ7Ca4PJRzk5TWwzpsvPlj8WFYrkZaaogkOsuaZTBNX7ltPaSoX1ZOzcfJdlQ9Jrk4wkaCjdovoYWrrUOrEVQFA"
          alt="Elegant Saree Draped on Model"
          className="w-full h-full object-cover object-top opacity-90 dark:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 dark:from-background/70 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="max-w-xl space-y-6">
          <span className="inline-block py-1 px-3 border border-primary text-primary uppercase text-[10px] tracking-[0.3em] bg-secondary/40 text-secondary-foreground backdrop-blur-md rounded-sm">
            New Arrivals
          </span>

          <h1 className="font-display text-5xl md:text-7xl leading-tight">
            Timeless <span className="italic text-primary">Elegance</span>,<br />
            Woven in Tradition.
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-md border-l-4 border-primary pl-4">
            Discover our exclusive range of handpicked sarees and ethnic wear,
            crafted to perfection for the modern woman.
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
              Enquire Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
