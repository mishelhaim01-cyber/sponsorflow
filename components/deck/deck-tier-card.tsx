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
  /** Count of ALL confirmed sponsorships (public + private) — used for remaining calculation */
  confirmedCount: number;
  /** totalSlots - confirmedCount */
  remaining: number;
  /** Only confirmed + isPublic sponsorships — safe to display */
  publicSponsors: PublicSponsor[];
};

type Props = {
  tier: PublicTierData;
  primaryColor: string;
  slug: string;
};

export function DeckTierCard({ tier, primaryColor, slug }: Props) {
  const isFull = tier.remaining <= 0;
  const isLastSpot = tier.remaining === 1;

  return (
    <div className="deck-tier-card flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Coloured header */}
      <div className="px-7 py-7" style={{ backgroundColor: primaryColor }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-2">
          {tier.name}
        </p>
        <p className="text-4xl font-bold text-white leading-none">
          {formatCurrency(tier.price)}
        </p>
        {tier.description && (
          <p className="mt-3 text-sm text-white/75 leading-relaxed">
            {tier.description}
          </p>
        )}
      </div>

      {/* Body — benefits */}
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
      <div className="border-t border-gray-100 px-7 py-5 space-y-4">
        {/* Confirmed public sponsors */}
        {tier.publicSponsors.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2.5">
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
                    className="h-8 w-auto max-w-[120px] object-contain"
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
              isFull ? "bg-gray-300" : isLastSpot ? "bg-amber-400" : "bg-green-400"
            }`}
          />
          <span className={`text-sm font-medium ${isFull ? "text-gray-400" : "text-gray-700"}`}>
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
