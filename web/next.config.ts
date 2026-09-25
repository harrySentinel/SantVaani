import path from 'node:path';
import type { NextConfig } from 'next';

// Pages not yet migrated are served by the legacy Vite app. Next.js checks its own routes
// and static files first; anything unmatched is proxied here, so no per-page config is needed.
const legacyAppUrl = process.env.LEGACY_APP_URL;

const nextConfig: NextConfig = {
  // The repo root has its own lockfile; pin the app root so Next.js doesn't guess.
  turbopack: { root: path.resolve(__dirname) },
  outputFileTracingRoot: path.resolve(__dirname),
  async rewrites() {
    if (!legacyAppUrl) return [];
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [{ source: '/:path*', destination: `${legacyAppUrl}/:path*` }],
    };
  },
};

export default nextConfig;
