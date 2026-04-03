export const SITE = {
  name: "Ashen Archive",
  person: "Zhouyu Liao",
  siteUrl: "https://pen364692088.github.io",
  basePath: "/CVWebsite",
  localeStorageKey: "ashen-archive-locale",
} as const;

export const SECTION_IDS = ["about", "disciplines", "artifacts", "fire", "contact"] as const;

export function assetPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.basePath}${normalizedPath}`;
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE.siteUrl).toString();
}
