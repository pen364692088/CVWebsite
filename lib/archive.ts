export const ARCHIVE_LENSES = ["all", "moon", "tower", "ember"] as const;

export type ArchiveLens = (typeof ARCHIVE_LENSES)[number];
export type SigilLens = Exclude<ArchiveLens, "all">;

export const DEFAULT_ARCHIVE_LENS: ArchiveLens = "all";
export const ARCHIVE_LENS_KEY = "ashen-archive-lens";

export function isArchiveLens(value: string | null): value is ArchiveLens {
  return value !== null && ARCHIVE_LENSES.includes(value as ArchiveLens);
}
