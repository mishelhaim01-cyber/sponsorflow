import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/**
 * Returns the Clerk user ID of the currently authenticated user.
 * Redirects to /sign-in if not authenticated.
 * Also upserts the user into the database — ensures local dev works
 * even without the Clerk webhook configured.
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Upsert so the User row always exists before any related records are created.
  // In production the webhook handles this, but this is a safe fallback.
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? `${userId}@unknown.local`;

  await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId, email },
    update: {},
  });

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
