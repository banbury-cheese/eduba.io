import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_DOMAIN = "eduba.io";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  trustHost: true,
  callbacks: {
    signIn({ profile }) {
      const email = profile?.email;
      const verified = profile?.email_verified;
      if (!email || !verified) return false;
      return email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    error: "/api/auth/signin",
  },
});
