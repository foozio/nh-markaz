
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { MoonStarIcon } from '@/components/layout/quran-header';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 48 48" {...props}>
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.612-3.87-11.084-8.994l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C44.434 36.316 48 30.638 48 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
    );
  }

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/quran');
            toast({
                title: "Login Berhasil",
                description: "Selamat datang kembali di Markaz!",
            });
        } catch (error) {
            console.error("Error signing in with Google: ", error);
            toast({
                variant: "destructive",
                title: "Login Gagal",
                description: "Terjadi kesalahan saat mencoba masuk dengan Google. Silakan coba lagi.",
            });
        }
    };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-8 left-8 flex items-center gap-3">
             <MoonStarIcon className="h-6 w-6 text-primary" />
            <h1 className="font-headline text-2xl font-bold text-primary">
                Markaz
            </h1>
        </div>
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Masuk ke Akun Anda</CardTitle>
                <CardDescription>Gunakan akun Google Anda untuk melanjutkan.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleGoogleSignIn} className="w-full" variant="outline">
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Masuk dengan Google
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
