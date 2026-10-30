// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { cookies, headers } from "next/headers";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
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
        if (!credentials?.email || !credentials?.password) return null;

        const normalizedEmail = (credentials.email as string).toLowerCase().trim();
        const inputPassword = credentials.password as string;

        try {
          // Query Firestore for the user by email
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", normalizedEmail));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            return null; // User not found
          }

          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          // STRICT CHECK: If no password is stored or if the password does not match, reject login
          if (!userData.password || userData.password !== inputPassword) {
            return null; // Wrong password -> Fails authentication and triggers error message
          }

          return {
            id: userDoc.id,
            email: normalizedEmail,
            name: userData.fullName || "User",
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        if (!user.email) return false;

        const normalizedEmail = user.email.toLowerCase().trim();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", normalizedEmail));
        const querySnapshot = await getDocs(q);

        // 1. Read Cookie
        const cookieStore = await cookies();
        const selectedTypeCookie = cookieStore.get("accountType")?.value;

        // 2. Read Request Headers / Referer URL as fallback
        const headersList = await headers();
        const referer = headersList.get("referer") || "";
        const reqUrl = headersList.get("x-url") || "";

        // Check if artisan intent is captured anywhere in the cookies, referer, or URL
        const isArtisanIntent =
          selectedTypeCookie === "artisan" ||
          referer.includes("type=artisan") ||
          referer.includes("artisan") ||
          reqUrl.includes("type=artisan");

        const selectedType = isArtisanIntent ? "artisan" : "client";

        if (querySnapshot.empty) {
          // ONLY create user record in the 'users' collection. 
          // No auto-creation in 'artisans' collection to prevent duplicates!
          await addDoc(usersRef, {
            fullName: user.name || "User",
            email: normalizedEmail,
            accountType: selectedType,
            image: user.image || "",
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