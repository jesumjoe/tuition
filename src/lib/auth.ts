import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "namma-tuition-demo-secret-key-min-32-chars",
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Demo Mode",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "demo@example.com") {
          return {
            id: "demo-tutor-id",
            name: "Demo Tutor",
            email: "demo@example.com",
          };
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    newUser: "/onboarding",
  },
};
