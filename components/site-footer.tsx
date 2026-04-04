import type { Dictionary } from "@/data/dictionaries";

export function SiteFooter({ dictionary }: { dictionary: Dictionary }) {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="site-footer-line mx-auto w-full max-w-7xl px-5 text-sm text-mist sm:px-8">{dictionary.footer.line}</div>
    </footer>
  );
}
