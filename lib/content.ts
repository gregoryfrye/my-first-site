import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Stat = {
  value: string;
  label: string;
};

export type CaseStudyFrontmatter = {
  title: string;
  role: string;
  years: string;
  featured?: boolean;
  summary: string;
  /** Three max, by design. */
  stats?: Stat[];
};

export type CaseStudy = {
  slug: string;
  frontmatter: CaseStudyFrontmatter;
  content: string;
};

function isCaseStudyDir(name: string): boolean {
  const full = path.join(CONTENT_DIR, name);
  return (
    fs.statSync(full).isDirectory() &&
    fs.existsSync(path.join(full, "index.mdx"))
  );
}

/** All case studies in /content, each a folder with an index.mdx. */
export function getAllCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter(isCaseStudyDir)
    .map((slug) => getCaseStudyBySlug(slug))
    .filter((study): study is CaseStudy => study !== null);
}

/** A single case study by its /content folder slug. */
export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  const filePath = path.join(CONTENT_DIR, slug, "index.mdx");
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as CaseStudyFrontmatter, content };
}

/** The case study flagged featured: true in frontmatter, if any. */
export function getFeaturedCaseStudy(): CaseStudy | null {
  return getAllCaseStudies().find((study) => study.frontmatter.featured) ?? null;
}

/**
 * Image filenames in a case study's /images folder, in display order.
 * Order is driven by filename prefix (01-, 02-, ...).
 */
export function getCaseStudyImages(slug: string): string[] {
  const imagesDir = path.join(CONTENT_DIR, slug, "images");
  if (!fs.existsSync(imagesDir)) return [];
  return fs
    .readdirSync(imagesDir)
    .filter((file) => /\.(png|jpe?g|webp|gif|avif)$/i.test(file))
    .sort();
}
