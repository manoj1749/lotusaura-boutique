export function FeatureStrip() {
  return (
    <section className="py-12 bg-secondary/20 dark:bg-card border-b border-border/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-4">
          <h3 className="font-display text-xl mb-2">Unique • Modern • Classy</h3>
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Customization available for all designs..
          </p>
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            DM to design your perfect look 💬
          </p>
        </div>
      </div>
    </section>
  );
}
