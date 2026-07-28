# CLAUDE.md

Conventions for this repo. Read before touching content or styling.

## Content

- All content lives in `/content`. It is the source of truth — nothing gets
  duplicated into `/public`; images are served at request time by
  `app/content-images/[...segments]/route.ts` reading straight from
  `/content`.
- Each case study is a folder: `/content/<slug>/index.mdx` plus an
  `/content/<slug>/images` subfolder.
  - `index.mdx` frontmatter: `title`, `role`, `years`, `featured`, `summary`,
    optional `stats`.
  - Image filenames are prefixed `01-`, `02-`, etc. Prefix order is display
    order — `lib/content.ts` sorts the `/images` folder by filename.
  - `stats` is an optional array of `{ value, label }`. Renders as a
    horizontal stat row between the summary and the body. Three max, by
    design — the template truncates past that. Omit the field entirely if a
    case study has no stats; the row doesn't render.
- `lib/content.ts` is the only code that reads `/content`. Parses frontmatter
  with `gray-matter`. Exposes `getAllCaseStudies`, `getCaseStudyBySlug`,
  `getFeaturedCaseStudy`, `getCaseStudyImages`. Add new content readers there,
  not inline in pages.
- `content/roles.ts` exports the `roles` array (company, title, years,
  location, clients, description, optional `slug`). A `slug` must match a
  `/content` folder — that's what makes a role linkable from the landing
  page's roles index.

### Where this is headed

Content will grow into a linked structure: **roles → clients → projects**,
with **studies** (inputs) and **artifacts** (outputs) attached to projects via
slug references in frontmatter — not by copy-pasting text between entities.
When adding entity types, follow that pattern: reference by slug, never
duplicate content across entities.

## Copy tone

Declarative and short. No soft narrative paragraphs. State what happened.

Declarative doesn't mean flat: a named tension or a stated bet is strategic
content. The rule targets mood-language (shepherding, resonance, journey),
not thesis statements.

Case studies follow five beats: Situation, Complication, Ask, Approach,
Outcome. Each beat is 1–2 declarative sentences. The Approach states a
strategic decision, not a process.

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
