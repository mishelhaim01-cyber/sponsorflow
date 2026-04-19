import { formatCurrency } from "@/lib/utils";
import { ReserveSpotForm } from "./reserve-spot-form";

export type PublicSponsor = {
  id: string;
  sponsorName: string;
  sponsorLogoUrl: string | null;
};

export type PublicTierData = {
  id: string;
  name: string;
  price: string;
  totalSlots: number;
  description: string | null;
  benefits: string[];
  confirmedCount: number;
  remaining: number;
  publicSponsors: PublicSponsor[];
};

type Props = {
  tier: PublicTierData;
  primaryColor: string;
  slug: string;
  featured?: boolean;
};

export function DeckTierCard({ tier, primaryColor, slug, featured = false }: Props) {
  const isFull = tier.remaining <= 0;
  const isLastSpot = tier.remaining === 1;

  return (
    <div className="flex flex-col rounded-2xl bg-white overflow-hidden shadow-xl">
      {/* Top accent bar — thicker on featured */}
      <div
        className={featured ? "h-2" : "h-1"}
        style={{ backgroundColor: primaryColor }}
      />

      {/* Header */}
      <div className="px-7 pt-7 pb-5">
        {featured && (
          <div className="mb-3">
            <span
              className="inline-block rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Top Package
            </span>
          </div>
        )}
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          {tier.name}
        </p>
        <p className="text-4xl font-bold text-gray-900 leading-none">
          {formatCurrency(tier.price)}
        </p>
        {tier.description && (
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            {tier.description}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="mx-7 border-t border-gray-100" />

      {/* Benefits */}
      <div className="flex-1 px-7 py-6">
        {tier.benefits.length > 0 && (
          <ul className="space-y-3">
            {tier.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-gray-700">
                <span
                  className="mt-0.5 shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="px-7 pb-7 pt-3 space-y-4">
        {/* Confirmed public sponsors */}
        {tier.publicSponsors.length > 0 && (
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              {tier.confirmedCount === 1 ? "Presenting sponsor" : "Presenting sponsors"}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {tier.publicSponsors.map((sponsor) =>
                sponsor.sponsorLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={sponsor.id}
                    src={sponsor.sponsorLogoUrl}
                    alt={sponsor.sponsorName}
                    className="h-7 w-auto max-w-[100px] object-contain"
                  />
                ) : (
                  <span key={sponsor.id} className="text-sm font-semibold text-gray-700">
                    {sponsor.sponsorName}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Availability */}
        <div className="flex items-center gap-2.5">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              isFull ? "bg-gray-300" : isLastSpot ? "bg-amber-400" : "bg-emerald-400"
            }`}
          />
          <span className={`text-xs font-medium ${isFull ? "text-gray-400" : "text-gray-600"}`}>
            {isFull
              ? "All spots filled"
              : isLastSpot
              ? "1 spot remaining — last chance"
              : `${tier.remaining} of ${tier.totalSlots} spot${tier.totalSlots !== 1 ? "s" : ""} remaining`}
          </span>
        </div>

        {/* Reserve button */}
        <ReserveSpotForm
          tierId={tier.id}
          tierName={tier.name}
          slug={slug}
          primaryColor={primaryColor}
          isFull={isFull}
        />
      </div>
    </div>
  );
}
