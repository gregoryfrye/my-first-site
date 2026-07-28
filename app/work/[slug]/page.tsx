import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllCaseStudies,
  getCaseStudyBySlug,
  getCaseStudyImages,
} from "@/lib/content";

export function generateStaticParams() {
  return getAllCaseStudies().map((study) => ({ slug: study.slug }));
}

const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-12 mb-3 font-serif text-lg text-ink first:mt-0" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-body text-muted" {...props} />
  ),
};

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  const images = getCaseStudyImages(slug);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-gutter pt-40 pb-20">
      <Link href="/" className="text-caption text-muted no-underline hover:text-ink">
        ← Greg Frye
      </Link>

      <header className="mt-12 mb-16">
        <p className="text-caption tracking-tight text-muted uppercase">
          {study.frontmatter.role} · {study.frontmatter.years}
        </p>
        <h1 className="mt-2 font-serif text-heading text-ink">{study.frontmatter.title}</h1>
        <p className="mt-6 text-body text-muted">{study.frontmatter.summary}</p>
      </header>

      <article>
        <MDXRemote source={study.content} components={mdxComponents} />
      </article>

      {images.length > 0 && (
        <section aria-label="Gallery" className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {images.map((file) => (
            <div key={file} className="relative aspect-[4/3] overflow-hidden bg-border">
              <Image
                src={`/content-images/${slug}/images/${file}`}
                alt={`${study.frontmatter.title} — ${file}`}
                fill
                sizes="(min-width: 672px) 336px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
