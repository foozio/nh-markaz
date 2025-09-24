import { getServerSession, type NextAuthOptions } from 'next-auth';
import type { Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getRequiredEnv('GOOGLE_CLIENT_ID'),
      clientSecret: getRequiredEnv('GOOGLE_CLIENT_SECRET'),
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getServerAuthSession = () => getServerSession(authOptions);
export type { Session };
