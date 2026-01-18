import { Gem, Scissors, Truck } from "lucide-react";

export function FeatureStrip() {
  return (
    <section className="py-12 bg-secondary/20 dark:bg-card border-b border-border/40">
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
  );
}
