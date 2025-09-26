
'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import type { Surah, Bookmark } from '@/lib/quran-data';
import { RichTextEditor } from './rich-text-editor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark as BookmarkIcon, Save, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
  
  interface RightSidebarProps {
    surah: Surah | null;
    notes: string;
    onNotesChange: (notes: string) => void;
    bookmarks: Bookmark[];
    onNavigateToVerse: (bookmark: Bookmark) => void;
    onSaveNotes: () => void;
    isSavingNotes: boolean;
    isLoadingNotes: boolean;
  }
  
  export function RightSidebar({ surah, notes, onNotesChange, bookmarks, onNavigateToVerse, onSaveNotes, isSavingNotes, isLoadingNotes }: RightSidebarProps) {
    return (
      <aside className="w-[350px] border-l bg-background p-4 flex flex-col min-h-0 overflow-hidden">
        <Tabs defaultValue="notes" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notes">Catatan Saya</TabsTrigger>
                <TabsTrigger value="bookmarks">
                    <BookmarkIcon className="mr-2 h-4 w-4"/>
                    Penanda
                </TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="mt-4 flex flex-1 flex-col min-h-0 overflow-hidden">
                <Card className="flex flex-1 flex-col shadow-none border-0 min-h-0 overflow-hidden">
                    <CardHeader className='p-0 pb-4'>
                        <div className="flex items-center justify-between">
                             <CardTitle className="font-headline text-xl font-semibold">Catatan Saya</CardTitle>
                             <Button
                               size="sm"
                               onClick={onSaveNotes}
                               disabled={isSavingNotes || isLoadingNotes}
                               aria-label="Simpan catatan"
                               title="Simpan catatan"
                             >
                                {isSavingNotes ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col p-0 min-h-0 overflow-hidden">
                        {isLoadingNotes ? (
                           <div className="space-y-2 flex-1">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                           </div>
                        ) : surah ? (
                            <RichTextEditor
                            content={notes}
                            onChange={onNotesChange}
                            placeholder={`Tuliskan refleksi Anda tentang ${surah.name.transliteration.en}...`}
                            />
                        ) : (
                        <div className="flex-1 flex items-center justify-center text-center text-sm text-muted-foreground p-4 rounded-md border bg-muted/20">
                            <p>Pilih surah untuk mulai membuat catatan.</p>
                        </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="bookmarks" className="mt-4 flex flex-1 flex-col min-h-0 overflow-hidden">
                <Card className="flex flex-1 flex-col shadow-none border-0 min-h-0 overflow-hidden">
                    <CardHeader className='p-0 pb-4'>
                        <CardTitle className="font-headline text-xl font-semibold">Penanda Ayat</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col p-0 min-h-0 overflow-hidden">
                       <ScrollArea className='h-[400px] rounded-md border'>
                         <div className="p-4">
                            {bookmarks.length > 0 ? (
                                <ul className='space-y-2'>
                                    {bookmarks.map((bookmark, index) => (
                                        <li key={index}>
                                            <button
                                                onClick={() => onNavigateToVerse(bookmark)}
                                                className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors"
                                            >
                                                <p className="font-semibold">{bookmark.surahName} {bookmark.surahNumber}:{bookmark.verseNumber}</p>
                                                <p className="text-sm text-muted-foreground truncate">{bookmark.text}</p>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground p-4">
                                    <p>Anda belum memiliki penanda. Tandai ayat untuk menyimpannya di sini.</p>
                                </div>
                            )}
                         </div>
                       </ScrollArea>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </aside>
    );
  }
