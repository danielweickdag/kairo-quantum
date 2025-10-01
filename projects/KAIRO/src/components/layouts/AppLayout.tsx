'use client';

import { ReactNode } from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export default function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/demo', '/'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!loading && requireAuth && !user && !isPublicRoute) {
      router.push('/login');
    }
  }, [user, loading, requireAuth, isPublicRoute, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // For public routes or when auth is not required, show content without navigation
  if (!requireAuth || isPublicRoute) {
    return <>{children}</>;
  }

  // For authenticated routes, show navigation + content
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      {/* Main content area with proper spacing for navigation */}
      <div className="lg:pl-64 lg:pt-16">
        {/* Content wrapper with padding */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
      
      {/* Bottom spacing for mobile navigation */}
      <div className="h-16 lg:hidden"></div>
    </div>
  );
}