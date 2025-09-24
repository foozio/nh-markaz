
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
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
  
  interface RightSidebarProps {
    surah: Surah | null;
    notes: string;
    onNotesChange: (notes: string) => void;
    bookmarks: Bookmark[];
    onNavigateToVerse: (bookmark: Bookmark) => void;
  }
  
  export function RightSidebar({ surah, notes, onNotesChange, bookmarks, onNavigateToVerse }: RightSidebarProps) {
    return (
      <aside className="w-[350px] border-l bg-background p-4 flex flex-col">
        <Tabs defaultValue="notes" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notes">Catatan Saya</TabsTrigger>
                <TabsTrigger value="bookmarks">
                    <BookmarkIcon className="mr-2 h-4 w-4"/>
                    Penanda
                </TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="flex-1 flex flex-col mt-4">
                <Card className="flex-1 flex flex-col shadow-none border-0">
                    <CardHeader className='p-0 pb-4'>
                        <CardTitle className="font-headline text-xl font-semibold">Catatan Saya</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-0">
                        {surah ? (
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
            <TabsContent value="bookmarks" className="flex-1 flex flex-col mt-4">
                <Card className="flex-1 flex flex-col shadow-none border-0">
                    <CardHeader className='p-0 pb-4'>
                        <CardTitle className="font-headline text-xl font-semibold">Penanda Ayat</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-0">
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
