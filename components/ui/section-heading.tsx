export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</p>
      <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h2>
      <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{description}</p>
    </div>
  );
}
