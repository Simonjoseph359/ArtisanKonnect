import { signIn } from "next-auth/react";
import type { User } from "firebase/auth";

// The app reads NextAuth sessions everywhere, so a Firebase login must be
// exchanged for one before redirecting to a protected page.
export async function createAppSession(user: User) {
  const idToken = await user.getIdToken();
  const res = await signIn("firebase", { idToken, redirect: false });

  if (!res || res.error) {
    throw new Error("We couldn't start your session. Please try again.");
  }
}

export function getOAuthErrorMessage(err: any) {
  switch (err?.code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled. Please try again.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup. Please allow popups and try again.";
    case "auth/account-exists-with-different-credential":
      return "This email is already linked to another sign-in method. Please use that method instead.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled yet.";
    default:
      return err?.code ? "Social authentication failed. Please try again." : err?.message;
  }
}
