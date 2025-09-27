
'use client';

import React, { createContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

// Extended user type with display properties
export interface ExtendedUser extends User {
  name?: string;
  image?: string;
}

export interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/', '/login'];

function AuthStateGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = pathname ? publicRoutes.includes(pathname) : false;

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const extendedUser: ExtendedUser = {
          ...session.user,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          image: session.user.user_metadata?.avatar_url || null
        };
        setUser(extendedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const extendedUser: ExtendedUser = {
          ...session.user,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          image: session.user.user_metadata?.avatar_url || null
        };
        setUser(extendedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user && !isPublicRoute) {
      router.push('/login');
    } else if (user && (pathname === '/login' || pathname === '/')) {
      router.push('/quran');
    }
  }, [user, loading, pathname, router, isPublicRoute]);

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
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthStateGate>{children}</AuthStateGate>;
}
