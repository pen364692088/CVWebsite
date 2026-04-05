import type { Dictionary } from "@/data/dictionaries";

export function SiteFooter({ dictionary }: { dictionary: Dictionary }) {
  return (
    <footer>
      <div className="site-footer-line text-sm text-mist">{dictionary.footer.line}</div>
    </footer>
  );
}
