import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  title: string;
  summary: string;
  clientName: string;
  imageSrc?: string;
  /** If set, the whole card links here (e.g. the parent client's case study). */
  href?: string;
};

export function ProjectCard({ title, summary, clientName, imageSrc, href }: ProjectCardProps) {
  const body = (
    <>
      {imageSrc && (
        <div className="relative aspect-[4/3] overflow-hidden bg-border">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(min-width: 640px) 288px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-gutter text-center">
        <h3 className="font-serif text-heading text-ink">{title}</h3>
        <p className="mt-4 text-body text-muted">{summary}</p>
        <p className="mt-2 text-caption tracking-tight text-muted uppercase">{clientName}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block border border-border no-underline transition-colors hover:border-ink"
      >
        {body}
      </Link>
    );
  }

  return <div className="block border border-border">{body}</div>;
}
