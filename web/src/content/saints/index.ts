import type { SaintContent } from './types';
import kabirDas from './sant-kabir-das';
import meeraBai from './meera-bai';
import tulsidas from './sant-tulsidas';
import surdas from './sant-surdas';
import rahim from './sant-rahim';
import raskhan from './sant-raskhan-ji';

// Saints with hand-written structured content, keyed by page slug.
const SAINT_CONTENT: Record<string, SaintContent> = {
  'sant-kabir-das': kabirDas,
  'meera-bai': meeraBai,
  'sant-tulsidas': tulsidas,
  'sant-surdas': surdas,
  'sant-rahim': rahim,
  'sant-raskhan-ji': raskhan,
};

export const getSaintContent = (slug: string): SaintContent | null => SAINT_CONTENT[slug] ?? null;
export type { SaintContent } from './types';
