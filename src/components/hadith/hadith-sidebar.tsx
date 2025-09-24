'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark as BookmarkIcon, Loader2, Save } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { RichTextEditor } from '@/components/quran/rich-text-editor';
import type { HadithBookmark } from './hadith-reader';

interface HadithSidebarProps {
  collectionName: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  bookmarks: HadithBookmark[];
  onNavigateToHadith: (bookmark: HadithBookmark) => void;
  onSaveNotes: () => void;
  isSavingNotes: boolean;
  isLoadingNotes: boolean;
  isAuthenticated: boolean;
}

export function HadithSidebar({
  collectionName,
  notes,
  onNotesChange,
  bookmarks,
  onNavigateToHadith,
  onSaveNotes,
  isSavingNotes,
  isLoadingNotes,
  isAuthenticated,
}: HadithSidebarProps) {
  return (
    <aside className="w-full border-t bg-background p-4 lg:w-[350px] lg:border-l lg:border-t-0">
      <Tabs defaultValue="notes" className="flex h-full flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes">Catatan Saya</TabsTrigger>
          <TabsTrigger value="bookmarks">
            <BookmarkIcon className="mr-2 h-4 w-4" />
            Penanda
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-4 flex flex-1 flex-col">
          <Card className="flex flex-1 flex-col border-0 shadow-none">
            <CardHeader className="p-0 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="font-headline text-xl font-semibold">Catatan {collectionName}</CardTitle>
                <Button size="sm" onClick={onSaveNotes} disabled={isSavingNotes || isLoadingNotes || !isAuthenticated}>
                  {isSavingNotes ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Simpan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-0">
              {isAuthenticated ? (
                isLoadingNotes ? (
                  <div className="space-y-2">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <RichTextEditor
                    content={notes}
                    onChange={onNotesChange}
                    placeholder={`Tuliskan refleksi Anda tentang koleksi ${collectionName}...`}
                  />
                )
              ) : (
                <div className="flex flex-1 items-center justify-center rounded-md border bg-muted/20 p-4 text-center text-sm text-muted-foreground">
                  <p>Masuk untuk menulis dan menyimpan catatan hadith.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarks" className="mt-4 flex flex-1 flex-col">
          <Card className="flex flex-1 flex-col border-0 shadow-none">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="font-headline text-xl font-semibold">Penanda Hadith</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-0">
              <ScrollArea className="h-[400px] rounded-md border">
                <div className="p-4">
                  {bookmarks.length > 0 ? (
                    <ul className="space-y-2">
                      {bookmarks.map((bookmark, index) => (
                        <li key={`${bookmark.collectionId}-${bookmark.number}-${index}`}>
                          <button
                            onClick={() => onNavigateToHadith(bookmark)}
                            className="w-full rounded-md p-2 text-left transition-colors hover:bg-muted"
                          >
                            <p className="font-semibold">{bookmark.collectionName} #{bookmark.number}</p>
                            <p className="text-sm text-muted-foreground truncate">{bookmark.excerpt}</p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                      <p>Belum ada penanda. Tandai hadith favorit Anda untuk akses cepat.</p>
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
