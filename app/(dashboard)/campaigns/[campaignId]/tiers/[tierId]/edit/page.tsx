import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { updateTier } from "@/actions/tiers";
import { TierForm } from "@/components/dashboard/tier-form";
import { DeleteTierButton } from "@/components/dashboard/delete-tier-button";

export default async function TierEditPage({
  params,
}: {
  params: { campaignId: string; tierId: string };
}) {
  const userId = await requireAuth();

  const tier = await prisma.sponsorshipTier.findFirst({
    where: { id: params.tierId, campaign: { userId } },
  });

  if (!tier) notFound();

  const updateAction = updateTier.bind(null, tier.id, params.campaignId);

  // Decimal price must be serialized before passing to a client component
  const initialData = {
    name: tier.name,
    price: Number(tier.price),
    totalSlots: tier.totalSlots,
    description: tier.description,
    benefits: tier.benefits,
    sortOrder: tier.sortOrder,
  };

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <Link
          href={`/campaigns/${params.campaignId}/tiers/${params.tierId}`}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back to sponsorships
        </Link>
        <h2 className="mt-3 text-base font-semibold text-gray-900">
          Edit tier: {tier.name}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Capacity is the total number of available spots for this tier.
          Sponsorship records are tracked separately.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <TierForm action={updateAction} initialData={initialData} mode="edit" />
      </div>

      <div className="rounded-lg border border-red-200 p-6">
        <h3 className="text-sm font-semibold text-red-700 mb-1">Danger zone</h3>
        <p className="text-sm text-gray-500 mb-4">
          Deleting this tier is permanent. All sponsorship records under this
          tier will also be removed.
        </p>
        <DeleteTierButton
          tierId={tier.id}
          campaignId={params.campaignId}
          variant="danger"
        />
      </div>
    </div>
  );
}
