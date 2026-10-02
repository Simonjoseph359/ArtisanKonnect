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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        if (!user.email) return false;

        const normalizedEmail = user.email.toLowerCase().trim();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", normalizedEmail));
        const querySnapshot = await getDocs(q);

        // Determine intended accountType from OAuth callback URL
        // const isArtisanCallback = account.callbackUrl?.includes("accountType=artisan") || account.callbackUrl?.includes("/artisan/");
        // const selectedType = isArtisanCallback ? "artisan" : "client";

        // ✅ Properly cast as String
        const callbackUrl = String(account?.callbackUrl || "");
        const selectedType = callbackUrl.includes("accountType=artisan") || callbackUrl.includes("/artisan/")
        ? "artisan"
        : "client";

        // Create user in Firestore if new
        if (querySnapshot.empty) {
          await addDoc(usersRef, {
            fullName: user.name || "User",
            email: normalizedEmail,
            accountType: selectedType,
            image: user.image || "",
            createdAt: new Date().toISOString(),
          });

          // If signing up as artisan, also populate the artisans collection
          if (selectedType === "artisan") {
            await addDoc(collection(db, "artisans"), {
              name: user.name || "User",
              email: normalizedEmail,
              image: user.image || "",
              createdAt: new Date().toISOString(),
            });
          }
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