import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/campaigns"
              className="text-sm font-semibold text-gray-900 tracking-tight"
            >
              SponsorFlow
            </Link>
            <nav>
              <Link
                href="/campaigns"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Campaigns
              </Link>
            </nav>
          </div>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
