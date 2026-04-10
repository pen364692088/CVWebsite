export const SHOWCASE_SECTION_IDS = [
  "hero-wordmark",
  "discipline-strip",
  "showcase-wall",
  "manifesto-inversion",
  "selected-work",
  "contact-coda",
] as const;

export type ShowcaseSectionId = (typeof SHOWCASE_SECTION_IDS)[number];
