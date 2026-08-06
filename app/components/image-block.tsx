import type { ImageBlockType } from "@/lib/content-blocks";

type ImageBlockProps = {
  type: ImageBlockType;
  /** URL-encoded JSON: { images: string[], caption?: string }. See content-blocks.ts. */
  payload: string;
};

function Placeholder({ description }: { description: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-border p-4 text-center">
      <p className="text-caption text-muted">{description}</p>
    </div>
  );
}

function Caption({ children }: { children: string }) {
  return <p className="mx-auto mt-3 max-w-prose text-body text-muted">{children}</p>;
}

/** full: full-bleed single image, breaks the text column. */
function FullBlock({ images, caption }: { images: string[]; caption?: string }) {
  return (
    <figure className="my-16">
      <div className="relative aspect-[16/9] overflow-hidden bg-border">
        <Placeholder description={images[0] ?? ""} />
      </div>
      {caption && <Caption>{caption}</Caption>}
    </figure>
  );
}

/** pair: two side by side, equal width, stack on mobile. */
function PairBlock({ images, caption }: { images: string[]; caption?: string }) {
  return (
    <figure className="my-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {images.map((description, i) => (
          <div key={i} className="relative aspect-[4/3] overflow-hidden bg-border">
            <Placeholder description={description} />
          </div>
        ))}
      </div>
      {caption && <Caption>{caption}</Caption>}
    </figure>
  );
}

/** inset: single image inline in the text column, no break. */
function InsetBlock({ images, caption }: { images: string[]; caption?: string }) {
  return (
    <figure className="mx-auto my-10 max-w-prose">
      <div className="relative aspect-[4/3] overflow-hidden bg-border">
        <Placeholder description={images[0] ?? ""} />
      </div>
      {caption && <figcaption className="mt-3 text-body text-muted">{caption}</figcaption>}
    </figure>
  );
}

/**
 * v1 stub for stagger, scroll, and motion: a simple vertical stack.
 * Upgrading each to its real behavior later is a component swap here,
 * not a content migration — the fence syntax and props don't change.
 */
function StackBlock({ images, caption }: { images: string[]; caption?: string }) {
  return (
    <figure className="my-16">
      <div className="flex flex-col gap-6">
        {images.map((description, i) => (
          <div key={i} className="relative aspect-[4/3] overflow-hidden bg-border">
            <Placeholder description={description} />
          </div>
        ))}
      </div>
      {caption && <Caption>{caption}</Caption>}
    </figure>
  );
}

export function ImageBlock({ type, payload }: ImageBlockProps) {
  const { images, caption } = JSON.parse(decodeURIComponent(payload)) as {
    images: string[];
    caption?: string;
  };

  switch (type) {
    case "full":
      return <FullBlock images={images} caption={caption} />;
    case "pair":
      return <PairBlock images={images} caption={caption} />;
    case "inset":
      return <InsetBlock images={images} caption={caption} />;
    case "stagger":
    case "scroll":
    case "motion":
      return <StackBlock images={images} caption={caption} />;
  }
}
