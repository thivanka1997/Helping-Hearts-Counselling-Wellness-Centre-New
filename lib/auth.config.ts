import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login', // On auth failure, redirect back to /login?error=CredentialsSignin
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'helping-hearts-super-secret-nextauth-key-2026-wellness',
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role ? String((user as any).role).toUpperCase() : 'STUDENT';
      }
      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.user?.name) token.name = session.user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        if (token.name) session.user.name = token.name as string;
        (session.user as any).role = token.role ? String(token.role).toUpperCase() : 'STUDENT';
      }
      return session;
    },
  },
  providers: [], // Configured with full providers in auth.ts
};
