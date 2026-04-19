import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createTier } from "@/actions/tiers";
import { TierCard } from "@/components/dashboard/tier-card";
import { AddTierSection } from "@/components/dashboard/add-tier-section";

export default async function TiersPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const userId = await requireAuth();

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.campaignId, userId },
    include: {
      tiers: {
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { sponsorships: true } } },
      },
    },
  });

  if (!campaign) notFound();

  // Bind campaignId into createTier so the client form never handles it
  const createTierAction = createTier.bind(null, campaign.id);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900">
          Sponsorship tiers
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Each tier represents an offer on your deck. Tiers appear in the order
          listed — adjust display order in the edit view.
        </p>
      </div>

      {campaign.tiers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-sm font-medium text-gray-900">No tiers yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Add your first sponsorship tier to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaign.tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} campaignId={campaign.id} />
          ))}
        </div>
      )}

      <AddTierSection createAction={createTierAction} />
    </div>
  );
}
