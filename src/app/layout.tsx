import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/components/layout/auth-provider';
import { getServerAuthSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Markaz',
  description: 'Aplikasi Quran yang indah dan elegan untuk bacaan dan studi spiritual.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Naskh+Arabic:wght@400..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider session={session}>
            {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
