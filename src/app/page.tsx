import { Header } from "@/components/layout/header";
import { QuranBrowser } from "@/components/quran/quran-browser";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1">
        <QuranBrowser />
      </main>
    </div>
  );
}
