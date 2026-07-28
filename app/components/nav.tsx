import Link from "next/link";

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-10 bg-canvas/85 px-gutter py-nav text-center backdrop-blur-sm">
      <Link href="/" className="font-serif text-body text-ink no-underline">
        Greg Frye
      </Link>
    </nav>
  );
}
