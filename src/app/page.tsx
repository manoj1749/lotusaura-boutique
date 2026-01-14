import Image from "next/image";
import { Gem, Scissors, Truck, MessageCircle, MapPin, Phone, Mail, Flower2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";


export default function HomePage() {
  return (
    // <main className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
    <main className="bg-secondary/30 bg-background text-foreground transition-colors duration-300">
      {/* Top announcement bar */}
      <div className="bg-secondary/30 dark:bg-surface-dark/50 py-2 text-center text-sm font-medium tracking-wide">
      <span className="text-primary-dark dark:text-primary">
        Free Shipping on Orders Above ₹5000 | Worldwide Shipping Available
      </span>
      </div>


      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-primary/20 shadow-sm transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-primary/50 bg-gradient-to-br from-secondary/60 to-background-light dark:to-surface-dark shadow-inner flex items-center justify-center">
              <Flower2 className="h-5 w-5 text-accent" />
              </div>

              <div>
                <div className="font-display text-xl sm:text-2xl font-bold tracking-wide">
                  Lotus Aura
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary">
                  Crafted For Her
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-8">
              <a className="text-sm uppercase tracking-widest font-semibold hover:text-primary" href="#">
                Home
              </a>
              <a className="text-sm uppercase tracking-widest font-semibold hover:text-primary" href="#collections">
                Collections
              </a>
              <a className="text-sm uppercase tracking-widest font-semibold hover:text-primary" href="#about">
                About Us
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Theme toggle later (keeping placeholder for UI parity) */}
             <ModeToggle />
              <a
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition"
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-lg"><MessageCircle className="h-5 w-5" /></span>
                <span className="hidden lg:inline text-xs font-bold uppercase tracking-wide">
                  Chat with Us
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative w-full h-[600px] md:h-[750px] overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDipmNDa3KcKVBXPqEM-hy4fv2-uStLeOXoqyxcWhRaIgd3zy96u9MWtP-YblHswkY_vWGB6cCCeIiahMIkMHrgTMlvJhkhy34IvdyPQVgkJcSDsitgohjfml6rAWPSHuzfybN9V-jDm0YGNZdEOHASpD0bA6pzKJZWo-304MEPD8RnbX6YOgxZcJ7Ca4PJRzk5TWwzpsvPlj8WFYrkZaaogkOsuaZTBNX7ltPaSoX1ZOzcfJdlQ9Jrk4wkaCjdovoYWrrUOrEVQFA"
            alt="Elegant Saree Draped on Model"
            className="w-full h-full object-cover object-top opacity-90 dark:opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-light/80 dark:from-background-dark/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="max-w-xl space-y-6">
            <span className="inline-block py-1 px-3 border border-primary text-primary uppercase text-[10px] tracking-[0.3em] bg-accent/40 text-accent-foreground backdrop-blur-md rounded-sm">
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
              <a
                href="#collections"
                className="bg-primary hover:bg-primary-dark text-white dark:text-black px-8 py-3 rounded-sm uppercase tracking-widest text-xs font-bold shadow-lg hover:shadow-xl transition"
              >
                View Collection
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="bg-surface-light/80 dark:bg-surface-dark/70 border border-white/60 dark:border-white/10 text-text-light dark:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark px-8 py-3 rounded-sm uppercase tracking-widest text-xs font-bold backdrop-blur-sm transition"
              >
                Enquire Now
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Feature strip */}
      <section className="py-12 bg-secondary/20 dark:bg-surface-dark border-b border-primary/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Gem className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl mb-2">Premium Quality</h3>
            <p className="text-sm text-muted-foreground">
              Handpicked fabrics ensuring the finest texture and longevity.
            </p>
          </div>

          <div className="p-4">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Scissors className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl mb-2">Custom Tailoring</h3>
            <p className="text-sm text-muted-foreground">
              Perfect fits customized to your measurements upon request.
            </p>
          </div>

          <div className="p-4">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl mb-2">Global Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Bringing our heritage to your doorstep, anywhere in the world.
            </p>
          </div>
        </div>
      </section>

      {/* Featured collections */}
      <section id="collections" className="py-20 bg-background-light dark:bg-background-dark">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="text-primary text-xs font-bold uppercase tracking-widest">
              Our Selection
            </div>
            <h2 className="font-display text-4xl mt-2 mb-4">
              Featured Collections
            </h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
          </div>

          {/* Static cards for UI now (we’ll hook DB next) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                tag: "Best Seller",
                tagColor: "bg-[#D4AF37] text-white",
                title: "Royal Banarasi Silk",
                subtitle: "Pure silk with zari border",
                price: "₹12,500",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtUfaMXHohPhp7MQE1_RZ5LnweWZQ4GxlygxzazeRNXRRbUzNuLKgLx2LDOIDaksS-6dD3XoGxNIpddS47NDz5H2sJNxMt90M4pOanQCWUGjk8gfJE8_o0abRrszht44VlJtYckd3HGRuYjtQkGugoZp-c0BwjqCVgl-54L_h9148RLELfslytFjcwQJjbuI4CdDzFZ-1bw-fPUOc5gmzf0fmB4NuIXznX29751H3SQjIZhN2ionSUTwBR-SIa-hrU8K6-Ou8k_t8",
              },
              {
                tag: "",
                tagColor: "",
                title: "Floral Organza Lehenga",
                subtitle: "Hand-painted motifs",
                price: "₹18,900",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsvo2a0ddpk1T63pHYw36h8lXoolS2L8oJbnYwJLltvJp48Wkfo1RVc8574udQYIVAQ4BHgFWP-gUavtNmAezdHxBscJzFZqfOFAvhveCg5yxRvqR1taDaqv32ZUOAJD4Zf78geTtPxFyFQo9J9QhLX3dQC0Zt5y2HwyChn_arWTdLUn4dWKsktdfRdqgNEJOX5KlUOEADoK0avLAT_fdAItGHyzjf9kji48GiGJ2B8oulplwqVpXayMSUYwvcapi4AY7n-L7thOo",
              },
              {
                tag: "New",
                tagColor: "bg-[#E8D3D9] text-[#4A403A]",
                title: "Emerald Chanderi Set",
                subtitle: "With intricate zari work",
                price: "₹6,800",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAb3iS8wKxG8aLEbes2HbdfVrYFI_-CPB2EC_9neEjsZPoECIUf0hCi-XSf1c3BR0c3b8csnwKAweV9lWnknLEATUldDLyGzfumzS1xh4rGodqymqbN1TsSlinbQiBNtWWlZjZK5UvtK0LV0xSqIZfZpbFa0tdjB6CB1IryHYNW5H2oOtW5k0UOvVGdWET0AJwLX5OaRxnCf660yYpapowgpYmg67-hUe-Y_ueuDaDedfXnXDSOip6YUJzxYEhEZ08OiKmhmwIoYBk",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="group relative bg-card text-card-foreground rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-primary/20 overflow-hidden"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                  {p.tag ? (
                    <div className="absolute top-4 left-4">
                      <span className={`${p.tagColor} text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wide`}>
                        {p.tag}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="p-6 text-center">
                  <h3 className="font-display text-2xl mb-1 group-hover:text-primary transition">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{p.subtitle}</p>
                  <p className="text-lg font-bold mb-6">{p.price}</p>

                  <a
                    className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded transition"
                    href="https://wa.me/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="text-lg"><MessageCircle className="h-5 w-5" /></span>
                    <span>Enquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-white transition"
            >
              View All Collections
            </a>
          </div>
        </div>
      </section>

      {/* About / Story */}
      <section id="about" className="py-20 bg-background-light dark:bg-background-dark">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl bg-gradient-to-br from-[#D4AF37]/80 to-[#E8D3D9]/40 p-4">
            <div className="rounded-xl overflow-hidden bg-card text-card-foreground shadow">
              <div className="h-[320px] md:h-[380px] flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-widest mb-2">
                    Visual Placeholder
                  </div>
                  <div className="font-display text-3xl">Lookbook / Brand Image</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    We’ll replace this with your brand photo later.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-primary text-xs font-bold uppercase tracking-widest">
              Our Story
            </div>
            <h3 className="font-display text-4xl mt-2 mb-4">
              Label by Lotus Aura
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">
              Born from a passion for India’s rich textile heritage, Lotus Aura is more than just a boutique—
              it’s a celebration of womanhood. We believe that every saree tells a story, and every drape should
              evoke a feeling of royalty.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Our collections are curated with love, focusing on intricate weaves, contemporary motifs, and a
              color palette that resonates with the modern Indian woman.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold">LA</span>
              </div>
              <div>
                <div className="text-sm font-semibold">The Founder</div>
                <div className="text-[10px] uppercase tracking-widest text-primary">
                  Lotus Aura
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-16 text-center">
          <div className="text-5xl text-primary/30">“</div>
          <p className="font-display italic text-lg md:text-xl text-muted-foreground">
            The saree I purchased was absolutely breathtaking. The quality of the silk and the intricacy of the work
            exceeded my expectations. Highly recommended!
          </p>
          <div className="mt-4 text-xs font-bold uppercase tracking-widest text-primary-dark dark:text-primary">
            — Anjali S.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-dark text-text-dark">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="font-display text-2xl font-bold">Lotus Aura</div>
            <p className="mt-3 text-sm text-text-dark/70">
              Bringing the essence of traditional weaving to the contemporary wardrobe. Crafted for her, with love.
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              Shop
            </div>
            <ul className="mt-4 space-y-2 text-sm text-text-dark/80">
              <li>New Arrivals</li>
              <li>Sarees</li>
              <li>Lehengas</li>
              <li>Suit Sets</li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              Information
            </div>
            <ul className="mt-4 space-y-2 text-sm text-text-dark/80">
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Shipping Policy</li>
              <li>Returns & Exchange</li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">
              Contact Us
            </div>
            <ul className="mt-4 space-y-2 text-sm text-text-dark/80">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Mumbai, Maharashtra, India</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@lotusaura.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-xs text-text-dark/60">
          © {new Date().getFullYear()} Lotus Aura. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
