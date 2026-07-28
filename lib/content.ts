import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const ROLES_DIR = path.join(CONTENT_DIR, "roles");
const CLIENTS_DIR = path.join(CONTENT_DIR, "clients");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");
const SKILLS_DIR = path.join(CONTENT_DIR, "skills");
const STUDIES_DIR = path.join(CONTENT_DIR, "studies");
const ARTIFACTS_DIR = path.join(CONTENT_DIR, "artifacts");

export type Stat = {
  value: string;
  label: string;
};

export type Role = {
  slug: string;
  company: string;
  title: string;
  years: string;
  location: string;
  /** Slugs into /content/clients, where an entity exists. */
  clients: string[];
  /** Plain-text clients with no entity. */
  names: string[];
  description: string;
};

/** A client is the case study entity — the five beats live here. */
export type Client = {
  slug: string;
  name: string;
  years: string;
  /** Slugs into /content/roles. */
  roles: string[];
  featured?: boolean;
  summary: string;
  /** Three max, by design. */
  stats?: Stat[];
  content: string;
};

/** A project is a chapter within a client's story — no beats. */
export type Project = {
  slug: string;
  title: string;
  /** Slug into /content/clients. */
  client: string;
  /** Slug into /content/roles. */
  role: string;
  year: string;
  /** Slugs into /content/skills. */
  skills: string[];
  summary: string;
  content: string;
  featured?: boolean;
  /** Filename within this project's /images folder. */
  featuredImage?: string;
};

export type Skill = {
  slug: string;
  name: string;
  summary: string;
};

/** Inputs. Folder convention defined here; no content yet. */
export type Study = {
  slug: string;
  title: string;
  summary: string;
  projects?: string[];
  clients?: string[];
};

/** Outputs. Folder convention defined here; no content yet. */
export type Artifact = {
  slug: string;
  title: string;
  type: string;
  /** Slug into /content/projects. */
  project: string;
  images?: string[];
};

function readMdx(filePath: string): { data: Record<string, unknown>; content: string } | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return matter(raw);
}

/** Slugs of flat .mdx files directly inside a collection folder (roles, skills). */
function listFlatSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/** Slugs of <slug>/index.mdx folders inside a collection folder (clients, projects, studies, artifacts). */
function listFolderSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => {
      const full = path.join(dir, name);
      return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, "index.mdx"));
    });
}

function listImageFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => /\.(png|jpe?g|webp|gif|avif)$/i.test(file))
    .sort();
}

// --- roles ---

/** Reverse-chronological: most recent era first, parsed from the years range. */
export function getAllRoles(): Role[] {
  return listFlatSlugs(ROLES_DIR)
    .map((slug) => getRoleBySlug(slug))
    .filter((role): role is Role => role !== null)
    .sort((a, b) => startYear(b.years) - startYear(a.years));
}

function startYear(years: string): number {
  return Number(years.match(/\d{4}/)?.[0] ?? 0);
}

export function getRoleBySlug(slug: string): Role | null {
  const parsed = readMdx(path.join(ROLES_DIR, `${slug}.mdx`));
  if (!parsed) return null;
  const { data } = parsed;
  return {
    slug,
    company: data.company as string,
    title: data.title as string,
    years: data.years as string,
    location: data.location as string,
    clients: (data.clients as string[] | undefined) ?? [],
    names: (data.names as string[] | undefined) ?? [],
    description: data.description as string,
  };
}

// --- clients (case studies) ---

export function getAllClients(): Client[] {
  return listFolderSlugs(CLIENTS_DIR)
    .map((slug) => getClientBySlug(slug))
    .filter((client): client is Client => client !== null);
}

export function getClientBySlug(slug: string): Client | null {
  const parsed = readMdx(path.join(CLIENTS_DIR, slug, "index.mdx"));
  if (!parsed) return null;
  const { data, content } = parsed;
  return {
    slug,
    name: data.name as string,
    years: data.years as string,
    roles: (data.roles as string[] | undefined) ?? [],
    featured: data.featured as boolean | undefined,
    summary: data.summary as string,
    stats: data.stats as Stat[] | undefined,
    content,
  };
}

export function getFeaturedClient(): Client | null {
  return getAllClients().find((client) => client.featured) ?? null;
}

export function getClientImages(slug: string): string[] {
  return listImageFiles(path.join(CLIENTS_DIR, slug, "images"));
}

// --- projects ---

export function getAllProjects(): Project[] {
  return listFolderSlugs(PROJECTS_DIR)
    .map((slug) => getProjectBySlug(slug))
    .filter((project): project is Project => project !== null);
}

export function getProjectBySlug(slug: string): Project | null {
  const parsed = readMdx(path.join(PROJECTS_DIR, slug, "index.mdx"));
  if (!parsed) return null;
  const { data, content } = parsed;
  return {
    slug,
    title: data.title as string,
    client: data.client as string,
    role: data.role as string,
    year: data.year as string,
    skills: (data.skills as string[] | undefined) ?? [],
    summary: data.summary as string,
    content,
    featured: data.featured as boolean | undefined,
    featuredImage: data.featuredImage as string | undefined,
  };
}

export function getProjectImages(slug: string): string[] {
  return listImageFiles(path.join(PROJECTS_DIR, slug, "images"));
}

/** featuredImage → first image by filename order → undefined (text-only card). */
export function getProjectCardImage(project: Project): string | undefined {
  return project.featuredImage ?? getProjectImages(project.slug)[0];
}

export function getProjectsByClient(clientSlug: string): Project[] {
  return getAllProjects().filter((project) => project.client === clientSlug);
}

/**
 * featured: true on a project wins. Otherwise, the first project (by
 * current sort) belonging to the featured client.
 */
export function getFeaturedProject(): Project | null {
  const explicit = getAllProjects().find((project) => project.featured);
  if (explicit) return explicit;

  const client = getFeaturedClient();
  if (!client) return null;
  return getProjectsByClient(client.slug)[0] ?? null;
}

export function getProjectsByRole(roleSlug: string): Project[] {
  return getAllProjects().filter((project) => project.role === roleSlug);
}

export function getProjectsBySkill(skillSlug: string): Project[] {
  return getAllProjects().filter((project) => project.skills.includes(skillSlug));
}

// --- skills ---

export function getAllSkills(): Skill[] {
  return listFlatSlugs(SKILLS_DIR)
    .map((slug) => getSkillBySlug(slug))
    .filter((skill): skill is Skill => skill !== null);
}

export function getSkillBySlug(slug: string): Skill | null {
  const parsed = readMdx(path.join(SKILLS_DIR, `${slug}.mdx`));
  if (!parsed) return null;
  const { data } = parsed;
  return { slug, name: data.name as string, summary: data.summary as string };
}

// --- studies (inputs) ---

export function getAllStudies(): Study[] {
  return listFolderSlugs(STUDIES_DIR)
    .map((slug) => getStudyBySlug(slug))
    .filter((study): study is Study => study !== null);
}

export function getStudyBySlug(slug: string): Study | null {
  const parsed = readMdx(path.join(STUDIES_DIR, slug, "index.mdx"));
  if (!parsed) return null;
  const { data } = parsed;
  return {
    slug,
    title: data.title as string,
    summary: data.summary as string,
    projects: data.projects as string[] | undefined,
    clients: data.clients as string[] | undefined,
  };
}

// --- artifacts (outputs) ---

export function getAllArtifacts(): Artifact[] {
  return listFolderSlugs(ARTIFACTS_DIR)
    .map((slug) => getArtifactBySlug(slug))
    .filter((artifact): artifact is Artifact => artifact !== null);
}

export function getArtifactBySlug(slug: string): Artifact | null {
  const parsed = readMdx(path.join(ARTIFACTS_DIR, slug, "index.mdx"));
  if (!parsed) return null;
  const { data } = parsed;
  return {
    slug,
    title: data.title as string,
    type: data.type as string,
    project: data.project as string,
    images: data.images as string[] | undefined,
  };
}

// --- reverse joins ---

export function getClientsByRole(roleSlug: string): Client[] {
  const role = getRoleBySlug(roleSlug);
  if (!role) return [];
  return role.clients
    .map((slug) => getClientBySlug(slug))
    .filter((client): client is Client => client !== null);
}

export function getRolesByClient(clientSlug: string): Role[] {
  return getAllRoles().filter((role) => role.clients.includes(clientSlug));
}

// --- build-time validation ---

/** Warns (does not throw) on any slug reference across collections that doesn't resolve. */
export function validateContentGraph(): string[] {
  const warnings: string[] = [];
  const roleSlugs = new Set(getAllRoles().map((role) => role.slug));
  const clientSlugs = new Set(getAllClients().map((client) => client.slug));
  const skillSlugs = new Set(getAllSkills().map((skill) => skill.slug));
  const projectSlugs = new Set(getAllProjects().map((project) => project.slug));

  for (const role of getAllRoles()) {
    for (const slug of role.clients) {
      if (!clientSlugs.has(slug)) {
        warnings.push(`role "${role.slug}" references missing client "${slug}"`);
      }
    }
  }

  for (const client of getAllClients()) {
    for (const slug of client.roles) {
      if (!roleSlugs.has(slug)) {
        warnings.push(`client "${client.slug}" references missing role "${slug}"`);
      }
    }
  }

  for (const project of getAllProjects()) {
    if (!clientSlugs.has(project.client)) {
      warnings.push(`project "${project.slug}" references missing client "${project.client}"`);
    }
    if (!roleSlugs.has(project.role)) {
      warnings.push(`project "${project.slug}" references missing role "${project.role}"`);
    }
    for (const slug of project.skills) {
      if (!skillSlugs.has(slug)) {
        warnings.push(`project "${project.slug}" references missing skill "${slug}"`);
      }
    }
  }

  for (const study of getAllStudies()) {
    for (const slug of study.projects ?? []) {
      if (!projectSlugs.has(slug)) {
        warnings.push(`study "${study.slug}" references missing project "${slug}"`);
      }
    }
    for (const slug of study.clients ?? []) {
      if (!clientSlugs.has(slug)) {
        warnings.push(`study "${study.slug}" references missing client "${slug}"`);
      }
    }
  }

  for (const artifact of getAllArtifacts()) {
    if (!projectSlugs.has(artifact.project)) {
      warnings.push(`artifact "${artifact.slug}" references missing project "${artifact.project}"`);
    }
  }

  if (warnings.length > 0) {
    console.warn(
      `[content] ${warnings.length} broken reference(s):\n${warnings.map((w) => `  - ${w}`).join("\n")}`,
    );
  }

  return warnings;
}
