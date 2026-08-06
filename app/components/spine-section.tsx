import type { ReactNode } from "react";

type SpineSectionProps = {
  label: string;
  subhead: string;
  children: ReactNode;
};

/**
 * Narrative (the argument): a reusable functional label plus a
 * project-specific subhead. Text-led — children render at prose width
 * except for ImageBlock variants that explicitly break the column.
 */
export function SpineSection({ label, subhead, children }: SpineSectionProps) {
  return (
    <section className="mt-20 first:mt-0">
      <div className="mx-auto max-w-prose">
        <p className="text-caption tracking-tight text-muted uppercase">{label}</p>
        <h2 className="mt-2 font-serif text-heading text-ink">{subhead}</h2>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}
