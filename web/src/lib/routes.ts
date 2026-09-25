// Paths served by this Next.js app. Everything else is proxied to the legacy Vite app
// (see `rewrites.fallback` in next.config.ts), so links to it must be full page loads.
const MIGRATED_PATHS = ['/prabhu-ki-leelaayen'];
const MIGRATED_PREFIXES = ['/prabhu-ki-leelaayen/book/', '/prabhu-ki-leelaayen/read/'];

export const isMigrated = (href: string) => {
  const path = href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  return MIGRATED_PATHS.includes(path) || MIGRATED_PREFIXES.some(prefix => path.startsWith(prefix));
};
