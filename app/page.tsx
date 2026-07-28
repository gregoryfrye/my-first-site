import Link from "next/link";
import { FeaturedCard } from "@/app/components/featured-card";
import {
  getAllRoles,
  getArtifactCardImage,
  getClientImages,
  getCurrentRole,
  getFeaturedOnHome,
  getProjectCardImage,
  getSkillBySlug,
  getSkillCardImage,
  type FeaturedEntity,
} from "@/lib/content";

type FeaturedCardData = {
  key: string;
  type: string;
  title: string;
  summary: string;
  href: string;
  imageSrc?: string;
};

function toCardData(item: FeaturedEntity): FeaturedCardData | null {
  switch (item.kind) {
    case "client":
      return {
        key: `client-${item.client.slug}`,
        type: "Client",
        title: item.client.name,
        summary: item.client.summary,
        href: `/work/${item.client.slug}`,
        imageSrc: (() => {
          const image = getClientImages(item.client.slug)[0];
          return image ? `/content-images/clients/${item.client.slug}/images/${image}` : undefined;
        })(),
      };
    case "project": {
      if (!item.client) return null;
      const image = getProjectCardImage(item.project);
      return {
        key: `project-${item.project.slug}`,
        type: "Project",
        title: item.project.title,
        summary: item.project.summary,
        href: `/work/${item.client.slug}`,
        imageSrc: image ? `/content-images/projects/${item.project.slug}/images/${image}` : undefined,
      };
    }
    case "skill": {
      const image = getSkillCardImage(item.skill);
      return {
        key: `skill-${item.skill.slug}`,
        type: "Skill",
        title: item.skill.name,
        summary: item.skill.summary,
        href: `/skills/${item.skill.slug}`,
        imageSrc: image ? `/content-images/skills/${item.skill.slug}/images/${image}` : undefined,
      };
    }
    case "artifact": {
      if (!item.client) return null;
      const image = getArtifactCardImage(item.artifact);
      return {
        key: `artifact-${item.artifact.slug}`,
        type: "Artifact",
        title: item.artifact.title,
        summary: item.artifact.summary,
        href: `/work/${item.client.slug}`,
        imageSrc: image ? `/content-images/artifacts/${item.artifact.slug}/images/${image}` : undefined,
      };
    }
    case "study": {
      if (!item.client) return null;
      return {
        key: `study-${item.study.slug}`,
        type: "Study",
        title: item.study.title,
        summary: item.study.summary,
        href: `/work/${item.client.slug}`,
      };
    }
  }
}

export default function Home() {
  const currentRole = getCurrentRole();
  const roles = getAllRoles();
  const featuredCards = getFeaturedOnHome()
    .map(toCardData)
    .filter((card): card is FeaturedCardData => card !== null);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-20 px-gutter pt-40 pb-20">
      <section className="flex flex-col gap-gutter sm:flex-row sm:items-start sm:justify-between">
        <div className="sm:flex-1">
          <h1 className="text-left font-serif text-heading tracking-tight text-ink">
            A whole-system creative director with 20 years channeling founder
            vision into a focused brand, product, and marketing function.
          </h1>
          {currentRole && (
            <p className="mt-6 text-body text-muted">{currentRole.description}</p>
          )}
        </div>

        {currentRole && currentRole.skills.length > 0 && (
          <ul className="flex shrink-0 flex-col gap-2">
            {currentRole.skills.map((skillSlug) => {
              const skill = getSkillBySlug(skillSlug);
              if (!skill) return null;
              return (
                <li key={skillSlug}>
                  <Link
                    href={`/skills/${skillSlug}`}
                    className="text-body text-ink underline decoration-border underline-offset-4 hover:decoration-ink"
                  >
                    {skill.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {featuredCards.length > 0 && (
        <section aria-label="Featured work" className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {featuredCards.map((card) => (
            <FeaturedCard
              key={card.key}
              type={card.type}
              title={card.title}
              summary={card.summary}
              href={card.href}
              imageSrc={card.imageSrc}
            />
          ))}
        </section>
      )}

      <section aria-label="Roles">
        <ul className="flex flex-col">
          {roles.map((role) => (
            <li
              key={role.slug}
              className="flex flex-col gap-1 border-b border-border py-4 first:pt-0 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="text-caption text-muted sm:w-28 sm:shrink-0">{role.years}</span>
              <span className="text-body text-ink sm:flex-1">
                {role.title},{" "}
                <Link
                  href={`/roles/${role.slug}`}
                  className="text-ink underline decoration-border underline-offset-4 hover:decoration-ink"
                >
                  {role.company}
                </Link>
                {role.names.length > 0 && (
                  <span className="text-muted"> — {role.names.join(", ")}</span>
                )}
              </span>
              <span className="text-body text-muted sm:flex-1">{role.description}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
