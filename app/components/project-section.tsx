import type { ReactNode } from "react";

type ProjectSectionProps = {
  title: string;
  children: ReactNode;
};

/**
 * Projects (the evidence): named, image-forward units. Visually distinct
 * from spine sections — a border rule and a bigger, unlabeled title signal
 * the mode change from argument to evidence.
 */
export function ProjectSection({ title, children }: ProjectSectionProps) {
  return (
    <section className="mt-20 border-t border-border pt-16 first:mt-0 first:border-t-0 first:pt-0">
      <h2 className="font-serif text-heading text-ink">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}
