export const LOCALES = ["en", "zh-CN", "ja", "ko"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  "zh-CN": "简体中文",
  ja: "日本語",
  ko: "한국어",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function normalizeBrowserLocale(value: string | null | undefined): Locale | null {
  if (!value) return null;
  if (isLocale(value)) return value;

  const normalized = value.toLowerCase();

  if (normalized.startsWith("zh")) return "zh-CN";
  if (normalized.startsWith("ja")) return "ja";
  if (normalized.startsWith("ko")) return "ko";
  if (normalized.startsWith("en")) return "en";

  return null;
}

export function resolvePreferredLocale(preferences: readonly string[]): Locale {
  for (const value of preferences) {
    const resolved = normalizeBrowserLocale(value);
    if (resolved) return resolved;
  }

  return DEFAULT_LOCALE;
}
