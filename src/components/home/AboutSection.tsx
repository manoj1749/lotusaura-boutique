import Image from "next/image";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl bg-gradient-to-br from-[#D4AF37]/80 to-[#E8D3D9]/40 p-4">
          <div className="rounded-xl overflow-hidden bg-card text-card-foreground shadow relative h-[320px] md:h-[380px]">
            <Image
              src="/LotusAuraBranding.jpeg"
              alt="Lotus Aura Branding"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
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
        <div className="text-5xl text-primary/30 font-serif">“</div>
        <p className="font-display italic text-lg md:text-xl text-muted-foreground relative -top-4">
          The saree I purchased was absolutely breathtaking. The quality of the silk and the intricacy of the work
          exceeded my expectations. Highly recommended!
        </p>
        <div className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">
          — Anjali S.
        </div>
      </div>
    </section>
  );
}
