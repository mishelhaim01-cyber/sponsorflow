import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { DeleteTierButton } from "./delete-tier-button";
import type { TierWithCount } from "@/types";

const MAX_VISIBLE_BENEFITS = 4;

type Props = {
  tier: TierWithCount;
  campaignId: string;
};

export function TierCard({ tier, campaignId }: Props) {
  const filled = tier._count.sponsorships;
  const visibleBenefits = tier.benefits.slice(0, MAX_VISIBLE_BENEFITS);
  const hiddenCount = tier.benefits.length - MAX_VISIBLE_BENEFITS;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{tier.name}</h3>
          <p className="mt-0.5 text-sm text-gray-500">
            {formatCurrency(tier.price.toString())} ·{" "}
            <span className="font-medium text-gray-700">
              {filled} of {tier.totalSlots} spot{tier.totalSlots !== 1 ? "s" : ""} filled
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Links to sponsorship management; /edit for the tier form */}
          <Link
            href={`/campaigns/${campaignId}/tiers/${tier.id}`}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Manage
          </Link>
          <Link
            href={`/campaigns/${campaignId}/tiers/${tier.id}/edit`}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
          <DeleteTierButton tierId={tier.id} campaignId={campaignId} />
        </div>
      </div>

      {tier.description && (
        <p className="mt-3 text-sm text-gray-600">{tier.description}</p>
      )}

      {tier.benefits.length > 0 && (
        <ul className="mt-3 space-y-1">
          {visibleBenefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-2 text-sm text-gray-600"
            >
              <span className="mt-0.5 shrink-0 text-gray-300">•</span>
              {benefit}
            </li>
          ))}
          {hiddenCount > 0 && (
            <li className="text-xs text-gray-400">
              +{hiddenCount} more benefit{hiddenCount !== 1 ? "s" : ""}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
