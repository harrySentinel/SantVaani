import type { SaintContent } from './types';
import kabirDas from './sant-kabir-das';

// Saints with hand-written structured content, keyed by page slug.
const SAINT_CONTENT: Record<string, SaintContent> = {
  'sant-kabir-das': kabirDas,
};

export const getSaintContent = (slug: string): SaintContent | null => SAINT_CONTENT[slug] ?? null;
export type { SaintContent } from './types';
