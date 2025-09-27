'use client';

import { useEffect } from 'react';

interface CacheProviderProps {
  children: React.ReactNode;
}

export function CacheProvider({ children }: CacheProviderProps) {
  useEffect(() => {
    // Cache provider initialized
  }, []);

  return <>{children}</>;
}