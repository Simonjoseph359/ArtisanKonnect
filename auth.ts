import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({ 
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        return {
          id: credentials.email as string,
          email: (credentials.email as string).toLowerCase().trim(),
          name: (credentials.name as string) || "User",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        if (!user.email) return true;

        const normalizedEmail = user.email.toLowerCase().trim();
        const q = query(
          collection(db, "users"),
          where("email", "==", normalizedEmail)
        );
        const querySnapshot = await getDocs(q);

        // If social user doesn't exist in Firestore yet, create default client record
        if (querySnapshot.empty) {
          await addDoc(collection(db, "users"), {
            fullName: user.name || "User",
            email: normalizedEmail,
            accountType: "client",
            createdAt: new Date().toISOString(),
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      const email = token.email || user?.email;
      if (email) {
        const normalizedEmail = email.toLowerCase().trim();
        const q = query(
          collection(db, "users"),
          where("email", "==", normalizedEmail)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          token.accountType = userData.accountType || "client";
        } else {
          token.accountType = "client";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { accountType?: string }).accountType =
          (token.accountType as string) || "client";
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});