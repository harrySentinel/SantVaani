// Paths served by this Next.js app. Everything else is proxied to the legacy Vite app
// (see `rewrites.fallback` in next.config.ts), so links to it must be full page loads.
const MIGRATED_PREFIXES = ['/prabhu-ki-leelaayen/book/', '/prabhu-ki-leelaayen/read/'];

export const isMigrated = (href: string) =>
  href.startsWith('/') && MIGRATED_PREFIXES.some(prefix => href.startsWith(prefix));
