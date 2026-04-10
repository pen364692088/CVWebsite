export function SiteFooter({ line }: { line: string }) {
  return (
    <footer>
      <div className="site-footer-line text-sm text-mist">{line}</div>
    </footer>
  );
}
