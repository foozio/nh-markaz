
'use client';

import React, { createContext, useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export interface AuthContextType {
  user: Session['user'] | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/', '/login'];

function AuthStateGate({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session && !isPublicRoute) {
      router.push('/login');
    } else if (session && (pathname === '/login' || pathname === '/')) {
      router.push('/quran');
    }
  }, [session, status, pathname, router, isPublicRoute]);

  const loading = status === 'loading';
  const user = session?.user ?? null;

  if (loading || (!user && !isPublicRoute) || (user && isPublicRoute)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center flex items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div>
            <h2 className="text-2xl font-bold font-headline">Memuat Aplikasi...</h2>
            <p className="text-muted-foreground">Silakan tunggu sebentar.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children, session }: { children: React.ReactNode; session: Session | null }) {
  return (
    <SessionProvider session={session}>
      <AuthStateGate>{children}</AuthStateGate>
    </SessionProvider>
  );
}
