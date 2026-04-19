import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Returns the Clerk user ID of the currently authenticated user.
 * Redirects to /sign-in if not authenticated.
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return userId;
}

/**
 * Returns full Clerk user object. Redirects if unauthenticated.
 */
export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  return user;
}
