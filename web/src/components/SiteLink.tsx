'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, type AnchorHTMLAttributes } from 'react';
import { isMigrated } from '@/lib/routes';

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string };

// Drop-in for react-router's <Link to>: client-side navigation for migrated pages, a normal link otherwise.
export default function SiteLink({ to, children, ...rest }: SiteLinkProps) {
  if (isMigrated(to)) {
    return <NextLink href={to} {...rest}>{children}</NextLink>;
  }
  return <a href={to} {...rest}>{children}</a>;
}

export function useSiteNavigate() {
  const router = useRouter();
  return useCallback((to: string) => {
    if (isMigrated(to)) router.push(to);
    else window.location.assign(to);
  }, [router]);
}
