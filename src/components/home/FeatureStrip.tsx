export function FeatureStrip() {
  return (
    <section className="py-6 md:py-10 bg-secondary/20 dark:bg-card border-y border-border/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40 text-center">
          <div className="py-4 md:py-2 md:px-6">
            <h3 className="font-display text-lg md:text-xl">Unique • Modern • Classy</h3>
          </div>

          <div className="py-4 md:py-2 md:px-6">
            <p className="text-sm text-muted-foreground">
              Customization available for all designs..
            </p>
          </div>

          <div className="py-4 md:py-2 md:px-6">
            <p className="text-sm text-muted-foreground">
              DM to design your perfect look 💬
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
