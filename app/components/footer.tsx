import { getMoonPhaseLabel } from "@/lib/moon";

export function Footer() {
  return (
    <footer className="grid grid-cols-1 gap-2 px-gutter py-gutter text-center text-caption text-muted sm:grid-cols-3 sm:items-center sm:text-left">
      <p className="sm:justify-self-start">☼ Kingston, NY, USA</p>
      <p className="sm:justify-self-center">© 2005–{new Date().getFullYear()}</p>
      <p className="sm:justify-self-end">{getMoonPhaseLabel()}</p>
    </footer>
  );
}
