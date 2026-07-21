import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: `${typeof window !== "undefined" ? window.location.origin : ""}/api/auth`,
});

export function useSession(): ReturnType<typeof authClient.useSession> {
  return authClient.useSession();
}

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
