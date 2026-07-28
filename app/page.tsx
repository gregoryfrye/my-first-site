import Image from "next/image";
import Link from "next/link";
import { getCaseStudyImages, getFeaturedCaseStudy } from "@/lib/content";
import { roles } from "@/content/roles";

export default function Home() {
  const featured = getFeaturedCaseStudy();
  const featuredImage = featured ? getCaseStudyImages(featured.slug)[0] : undefined;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-20 px-gutter pt-40 pb-20">
      <section className="grid grid-cols-1 gap-gutter sm:grid-cols-2 sm:items-center">
        <h1 className="text-left font-serif text-heading tracking-tight text-ink">
          A whole-system creative director with 20 years channeling founder
          vision into a focused brand, product, and marketing function.
        </h1>

        {featured && (
          <Link
            href={`/work/${featured.slug}`}
            className="block border border-border no-underline transition-colors hover:border-ink"
          >
            {featuredImage && (
              <div className="relative aspect-[4/3] overflow-hidden bg-border">
                <Image
                  src={`/content-images/${featured.slug}/images/${featuredImage}`}
                  alt={featured.frontmatter.title}
                  fill
                  sizes="(min-width: 640px) 288px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-gutter text-center">
              <p className="text-caption tracking-tight text-muted uppercase">
                {featured.frontmatter.role} · {featured.frontmatter.years}
              </p>
              <h2 className="mt-2 font-serif text-heading text-ink">
                {featured.frontmatter.title}
              </h2>
              <p className="mt-4 text-body text-muted">{featured.frontmatter.summary}</p>
            </div>
          </Link>
        )}
      </section>

      <section aria-label="Roles">
        <ul className="flex flex-col">
          {roles.map((role) => (
            <li
              key={`${role.company}-${role.years}`}
              className="flex flex-col gap-1 border-b border-border py-4 first:pt-0 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="text-caption text-muted sm:w-28 sm:shrink-0">{role.years}</span>
              <span className="text-body text-ink">
                {role.title},{" "}
                {role.slug ? (
                  <Link
                    href={`/work/${role.slug}`}
                    className="text-ink underline decoration-border underline-offset-4 hover:decoration-ink"
                  >
                    {role.company}
                  </Link>
                ) : (
                  role.company
                )}
                {role.clients.length > 0 && (
                  <span className="text-muted"> — {role.clients.join(", ")}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
