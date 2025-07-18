'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { DashboardNavigation } from '@/components/dashboard-navigation';

export function ConditionalNavigation() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // If user is authenticated and on dashboard routes, show dashboard navigation
  if (session && pathname.startsWith('/dashboard')) {
    return <DashboardNavigation />;
  }

  // If user is not authenticated and on landing page or auth pages, show landing navigation
  if (!session && (pathname === '/' || pathname.startsWith('/auth/'))) {
    return <Navigation />;
  }

  // For any other cases, don't show navigation
  return null;
}
