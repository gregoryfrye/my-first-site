const IMAGE_BLOCK_TYPES = ["full", "pair", "inset", "stagger", "scroll", "motion"] as const;

export type ImageBlockType = (typeof IMAGE_BLOCK_TYPES)[number];

function isImageBlockType(value: string): value is ImageBlockType {
  return (IMAGE_BLOCK_TYPES as readonly string[]).includes(value);
}

/**
 * Rewrites ::: type ... ::: fence blocks (the case-study content convention
 * for image placement) into <ImageBlock /> JSX tags MDX can render like any
 * other component.
 *
 * Props are passed as a single URL-encoded JSON string attribute rather than
 * expression-valued props ({images={[...]}}) — MDX's expression parser
 * doesn't reliably round-trip array/object literals injected this way when
 * nested inside another custom component's children, so images/caption
 * would arrive as undefined at render time. A plain quoted string attribute
 * sidesteps that entirely.
 *
 * ::: pair
 * 1. Cannabis plant against open sky
 * 2. Greenhouse canopy, overhead
 * Caption: Sun-grown, living soil, hand-trimmed.
 * :::
 */
export function preprocessFenceBlocks(source: string): string {
  const lines = source.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const openMatch = lines[i].match(/^:::\s*(\w+)\s*$/);
    if (openMatch && isImageBlockType(openMatch[1])) {
      const type = openMatch[1];
      const blockLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") {
        blockLines.push(lines[i]);
        i++;
      }
      i++; // skip the closing ':::'

      let caption: string | undefined;
      const images: string[] = [];
      for (const line of blockLines) {
        const trimmed = line.trim();
        if (trimmed === "") continue;
        const captionMatch = trimmed.match(/^Caption:\s*(.+)$/);
        if (captionMatch) {
          caption = captionMatch[1];
          continue;
        }
        const numberedMatch = trimmed.match(/^\d+\.\s*(.+)$/);
        images.push(numberedMatch ? numberedMatch[1] : trimmed);
      }

      const payload = encodeURIComponent(JSON.stringify({ images, caption }));
      out.push(`<ImageBlock type="${type}" payload="${payload}" />`);
      continue;
    }
    out.push(lines[i]);
    i++;
  }

  return out.join("\n");
}

/**
 * Splits a client's MDX body at the "## Results" heading. Projects render
 * between the two halves on the client page (spine → projects → results →
 * credits — see CLAUDE.md), so the template needs the spine on its own
 * without Results/Credits trailing behind it in the same MDXRemote pass.
 * No "## Results" heading means there's no closing section yet.
 */
export function splitClientContent(content: string): { narrative: string; closing: string } {
  const index = content.indexOf("## Results");
  if (index === -1) return { narrative: content, closing: "" };
  return { narrative: content.slice(0, index), closing: content.slice(index) };
}
