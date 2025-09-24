import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <MoonStarIcon className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-2xl font-bold text-primary">
          Noor Al-Quran
        </h1>
      </div>
    </header>
  );
}

function MoonStarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-accent", className)}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="hsl(var(--accent))" stroke="hsl(var(--accent))"/>
    </svg>
  );
}
