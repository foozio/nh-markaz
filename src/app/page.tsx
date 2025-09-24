import { Header } from "@/components/layout/header";
import { QuranBrowser } from "@/components/quran/quran-browser";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header />
        <main className="flex flex-1">
          <QuranBrowser />
        </main>
      </div>
    </SidebarProvider>
  );
}
