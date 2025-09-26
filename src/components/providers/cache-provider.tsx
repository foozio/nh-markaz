'use client';

import { useEffect } from 'react';

interface CacheProviderProps {
  children: React.ReactNode;
}

export function CacheProvider({ children }: CacheProviderProps) {
  useEffect(() => {
    // Cache initialization will be handled by individual components when needed
    console.log('Cache provider initialized');
  }, []);

  return <>{children}</>;
}