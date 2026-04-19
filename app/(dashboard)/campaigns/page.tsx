import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { CampaignCard } from "@/components/dashboard/campaign-card";

export default async function CampaignsPage() {
  const userId = await requireAuth();

  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Campaigns</h1>
        <Link
          href="/campaigns/new"
          className="rounded-md bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          New campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
          <h2 className="text-sm font-medium text-gray-900">No campaigns yet</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create your first campaign to get started.
          </p>
          <Link
            href="/campaigns/new"
            className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            New campaign
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
