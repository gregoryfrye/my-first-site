import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllClients,
  getClientBySlug,
  getClientImages,
  getProjectsByClient,
  getRolesByClient,
} from "@/lib/content";

export function generateStaticParams() {
  return getAllClients().map((client) => ({ slug: client.slug }));
}

const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-12 mb-3 font-serif text-lg text-ink first:mt-0" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-body text-muted" {...props} />
  ),
};

export default async function ClientPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client) notFound();

  const images = getClientImages(slug);
  const projects = getProjectsByClient(slug);
  const roleTitles = getRolesByClient(slug)
    .map((role) => role.title)
    .join(", ");

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-gutter pt-40 pb-20">
      <header className="mb-16">
        <p className="text-caption tracking-tight text-muted uppercase">
          {roleTitles} · {client.years}
        </p>
        <h1 className="mt-2 font-serif text-heading text-ink">{client.name}</h1>
        <p className="mt-6 text-body text-muted">{client.summary}</p>
      </header>

      {client.stats && client.stats.length > 0 && (
        <section aria-label="Stats" className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {client.stats.slice(0, 3).map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-heading text-ink">{stat.value}</p>
              <p className="mt-1 text-caption tracking-tight text-muted uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </section>
      )}

      <article>
        <MDXRemote source={client.content} components={mdxComponents} />
      </article>

      {images.length > 0 && (
        <section aria-label="Gallery" className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {images.map((file) => (
            <div key={file} className="relative aspect-[4/3] overflow-hidden bg-border">
              <Image
                src={`/content-images/clients/${slug}/images/${file}`}
                alt={`${client.name} — ${file}`}
                fill
                sizes="(min-width: 672px) 336px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section aria-label="Projects" className="mt-20">
          <h2 className="font-serif text-lg text-ink">Projects</h2>
          <ul className="mt-6 flex flex-col gap-8">
            {projects.map((project) => (
              <li key={project.slug}>
                <h3 className="font-serif text-body text-ink">{project.title}</h3>
                <p className="mt-1 text-body text-muted">{project.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
