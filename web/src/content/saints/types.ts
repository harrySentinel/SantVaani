// Hand-written, structured saint content. When a saint has an entry here, the profile page
// shows it instead of the single biography field from the database.

export interface Bilingual {
  hi: string;
  en: string;
}

export interface SaintVerse {
  /** Original text; lines separated by "\n". */
  text: string;
  arth: string;
  meaning: string;
  /** Optional one-line context: why this verse matters. */
  context?: Bilingual;
}

export interface SaintContent {
  seo: { title: string; description: string };
  scene: { heading: Bilingual; paragraphs: { hi: string[]; en: string[] } };
  verses: SaintVerse[];
  timeline: { when: Bilingual; text: Bilingual }[];
  today: Bilingual;
  faq: { q: Bilingual; a: Bilingual }[];
  /** Related reading elsewhere on Santvaani. */
  links?: { href: string; label: Bilingual; note: Bilingual }[];
  sameAs?: string[];
}
