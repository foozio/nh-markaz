
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SurahSummary } from '@/lib/quran-data';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Header({
  surahs,
  selectedSurah,
  onSelectSurah,
  isLoading,
}: {
  surahs: SurahSummary[];
  selectedSurah: SurahSummary | null;
  onSelectSurah: (surah: SurahSummary) => void;
  isLoading: boolean;
}) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
    toast({
        title: "Logout Berhasil",
        description: "Anda telah berhasil keluar.",
    });
  };

  const handleValueChange = (value: string) => {
    const surah = surahs.find((s) => s.number.toString() === value);
    if (surah) {
      onSelectSurah(surah);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <MoonStarIcon className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-2xl font-bold text-primary">
          Markaz
        </h1>
      </div>
      <div className='flex items-center gap-4'>
        <div className="w-64">
            <Select
            onValueChange={handleValueChange}
            value={selectedSurah?.number.toString()}
            disabled={isLoading || surahs.length === 0}
            >
            <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Memuat Surah..." : "Pilih Surah"} />
            </SelectTrigger>
            <SelectContent>
                {surahs.map((surah) => (
                <SelectItem key={surah.number} value={surah.number.toString()}>
                    {surah.number}. {surah.name.transliteration.en} ({surah.name.translation.id})
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className='cursor-pointer h-9 w-9'>
                    <AvatarImage src={user?.image || ''} alt={user?.name || 'User'}/>
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>
                    <p>Akun Saya</p>
                    <p className='text-xs font-normal text-muted-foreground'>{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className='cursor-pointer'>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
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
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" stroke="currentColor"/>
    </svg>
  );
}
