import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createSponsorship, updateSponsorship } from "@/actions/sponsorships";
import { formatCurrency } from "@/lib/utils";
import { SponsorshipRow } from "@/components/dashboard/sponsorship-row";
import { AddSponsorshipSection } from "@/components/dashboard/add-sponsorship-section";
import type { SponsorshipRowData } from "@/types";

export default async function TierSponsorshipsPage({
  params,
}: {
  params: { campaignId: string; tierId: string };
}) {
  const userId = await requireAuth();

  const tier = await prisma.sponsorshipTier.findFirst({
    where: { id: params.tierId, campaign: { userId } },
    include: {
      sponsorships: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!tier) notFound();

  const filled = tier.sponsorships.length;
  const remaining = tier.totalSlots - filled;
  const atCapacity = remaining <= 0;

  // Bind actions server-side — client components never handle campaign/tier IDs directly
  const createAction = createSponsorship.bind(null, tier.id, params.campaignId);

  // Serialize sponsorships: strip Date objects before passing to client components
  const sponsorshipRows: SponsorshipRowData[] = tier.sponsorships.map((s) => ({
    id: s.id,
    sponsorName: s.sponsorName,
    sponsorEmail: s.sponsorEmail,
    sponsorCompany: s.sponsorCompany,
    sponsorLogoUrl: s.sponsorLogoUrl,
    status: s.status,
    isPublic: s.isPublic,
    notes: s.notes,
  }));

  return (
    <div className="max-w-2xl">
      {/* Tier header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/campaigns/${params.campaignId}/tiers`}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Tiers
          </Link>
          <h2 className="mt-2 text-base font-semibold text-gray-900">
            {tier.name}
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {formatCurrency(tier.price.toString())} ·{" "}
            <span
              className={atCapacity ? "text-red-600 font-medium" : "text-gray-700 font-medium"}
            >
              {filled} of {tier.totalSlots} spot{tier.totalSlots !== 1 ? "s" : ""} filled
            </span>
            {!atCapacity && (
              <span className="text-gray-400">
                {" "}· {remaining} remaining
              </span>
            )}
          </p>
        </div>
        <Link
          href={`/campaigns/${params.campaignId}/tiers/${tier.id}/edit`}
          className="shrink-0 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Edit tier
        </Link>
      </div>

      {/* Sponsorship list */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Sponsorships
        </h3>

        {sponsorshipRows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-400">
              No sponsorships recorded yet. Add one below.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sponsorshipRows.map((sponsorship) => {
              // Bind the full ownership chain into the update action server-side
              const updateAction = updateSponsorship.bind(
                null,
                sponsorship.id,
                tier.id,
                params.campaignId
              );
              return (
                <SponsorshipRow
                  key={sponsorship.id}
                  sponsorship={sponsorship}
                  updateAction={updateAction}
                  tierId={tier.id}
                  campaignId={params.campaignId}
                />
              );
            })}
          </div>
        )}

        <AddSponsorshipSection
          createAction={createAction}
          atCapacity={atCapacity}
        />
      </div>

      {/* Legend */}
      <p className="mt-6 text-xs text-gray-400">
        ∗ Has internal notes &nbsp;·&nbsp; Internal notes are never shown on the
        public deck.
      </p>
    </div>
  );
}
