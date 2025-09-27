'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import * as LucideReact from 'lucide-react';
const { LogOut, BookOpen, Scroll, Search } = LucideReact as any;
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function MainHeader() {
  const { user } = useAuth();
  const { toast } = useToast();
  const pathname = usePathname();

 const { signOut } = useAuth();
    
    const handleSignOut = async () => {
        await signOut();
        toast({
      title: 'Logout Berhasil',
      description: 'Anda telah berhasil keluar.',
    });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const isQuranActive = pathname?.startsWith('/quran');
  const isHadithActive = pathname?.startsWith('/hadith');
  const isSearchActive = pathname?.startsWith('/search');

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-6 pt-4 pb-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <MoonStarIcon className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-2xl font-bold text-primary">Markaz</h1>
        </Link>
        
        {user && (
          <nav className="flex items-center gap-1">
            <Button
              variant={isQuranActive ? 'default' : 'ghost'}
              size="sm"
              asChild
              className={cn(
                'flex items-center gap-2',
                isQuranActive && 'bg-primary text-primary-foreground'
              )}
            >
              <Link href="/quran">
                <BookOpen className="h-4 w-4" />
                Quran
              </Link>
            </Button>
            <Button
              variant={isHadithActive ? 'default' : 'ghost'}
              size="sm"
              asChild
              className={cn(
                'flex items-center gap-2',
                isHadithActive && 'bg-primary text-primary-foreground'
              )}
            >
              <Link href="/hadith">
                <Scroll className="h-4 w-4" />
                Hadith
              </Link>
            </Button>
            <Button
              variant={isSearchActive ? 'default' : 'ghost'}
              size="sm"
              asChild
              className={cn(
                'flex items-center gap-2',
                isSearchActive && 'bg-primary text-primary-foreground'
              )}
            >
              <Link href="/search">
                <Search className="h-4 w-4" />
                Cari
              </Link>
            </Button>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p>Akun Saya</p>
                <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Daftar</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export function MoonStarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
        fill="hsl(var(--accent))"
        stroke="hsl(var(--accent))"
      />
    </svg>
  );
}