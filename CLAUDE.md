# CLAUDE.md

Conventions for this repo. Read before touching content or styling.

## Content

All content lives in `/content`, organized into six typed collections. It is
the source of truth — nothing gets duplicated into `/public`; images are
served at request time by `app/content-images/[...segments]/route.ts` reading
straight from `/content`.

The model: **roles → clients → projects**, with **skills** attached to
projects, and **studies** (inputs) / **artifacts** (outputs) attached to
projects or clients. Every cross-entity reference is a slug in frontmatter —
never copy-pasted text. `lib/content.ts` is the only code that reads
`/content`; it exposes a getter and `getAllX` for each collection, plus the
join functions (`getProjectsByClient`, `getProjectsByRole`,
`getProjectsBySkill`, `getClientsByRole`, `getRolesByClient`) and
`validateContentGraph()`, which warns at build time on any slug reference
that doesn't resolve. Call it, don't silently ignore broken refs.

- **Roles** — `/content/roles/<slug>.mdx`, flat files, one per era.
  Frontmatter: `company`, `title`, `years`, `location`, `clients` (slugs
  into `/content/clients`, where an entity exists), `names` (plain text for
  clients with no entity), `description`.
- **Clients** — `/content/clients/<slug>/index.mdx` + `/images`. **Clients
  are case studies** — the five beats (see Copy tone) live here, at the
  client level, nowhere else. Frontmatter: `name`, `years`, `roles` (slugs),
  `featured`, `summary`, `stats`.
- **Projects** — `/content/projects/<slug>/index.mdx` + `/images`.
  **Projects are chapters**, not case studies: no beats, no duplicating the
  client's story. Frontmatter: `title`, `client` (slug), `role` (slug),
  `year`, `skills` (slugs), `summary`. Body: scope and process notes.
- **Skills** — `/content/skills/<slug>.mdx`, flat files. Frontmatter:
  `name`, `summary`. No body.
- **Studies** (inputs) — `/content/studies/<slug>/index.mdx`. Frontmatter:
  `title`, `summary`, optional `projects`/`clients` (slugs).
- **Artifacts** (outputs) — `/content/artifacts/<slug>/index.mdx`.
  Frontmatter: `title`, `type`, `project` (slug), `images`.

Image filenames are prefixed `01-`, `02-`, etc. — prefix order is display
order; `lib/content.ts` sorts each `/images` folder by filename.

**Entities are earned by content.** Create an entity file only when there's a
real case study, project, study, or artifact behind it. A name with nothing
behind it is plain text (a role's `names[]`, unlinked text elsewhere) — never
a stub entity, and never a link to a route that doesn't exist.

## Copy tone

Declarative and short. No soft narrative paragraphs. State what happened.

Declarative doesn't mean flat: a named tension or a stated bet is strategic
content. The rule targets mood-language (shepherding, resonance, journey),
not thesis statements.

Case studies (clients) follow five beats: Situation, Complication, Ask,
Approach, Outcome. Each beat is 1–2 declarative sentences. The Approach
states a strategic decision, not a process. Projects don't get beats — see
Content.

## Styling

Tailwind design tokens only — type scale, spacing, color roles — defined in
the `@theme` block in `app/globals.css`. Never hardcode a color, font size, or
spacing value in a component. If a value doesn't have a token yet, add the
token, don't inline the value.

Current tokens (seeded from the pre-1.0 site, meant to be swapped wholesale
from a Figma sketch later):

- Colors: `canvas`, `ink`, `muted`, `border`
- Fonts: `font-serif` (primary), `font-sans` (secondary)
- Type scale: `text-display`, `text-heading`, `text-body`, `text-caption`
- Spacing: `spacing-nav`, `spacing-gutter`

## Scope discipline

This is a small, git-native site. Don't add content types, components, or
systems (captions, tagging, search, CMS UI) beyond what a task explicitly
asks for.

## Phase 1.5

Case study flow session — solve together: project/chapter ordering,
beat-anchored image placement, image sizing/presentation, and how chapters
and beats interleave on the client page.
