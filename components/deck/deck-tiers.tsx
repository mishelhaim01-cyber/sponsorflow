import { DeckTierCard, type PublicTierData } from "./deck-tier-card";

type Props = {
  tiers: PublicTierData[];
  primaryColor: string;
  slug: string;
};

export function DeckTiers({ tiers, primaryColor, slug }: Props) {
  return (
    <section className="py-20" style={{ backgroundColor: primaryColor }}>
      <div className="max-w-5xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10" style={{ backgroundColor: primaryColor }} />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: primaryColor }}
            >
              Partnership Opportunities
            </span>
            <div className="h-px w-10" style={{ backgroundColor: primaryColor }} />
          </div>
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Sponsorship Packages
          </h2>
          <p className="mt-4 text-gray-400 text-base max-w-xl mx-auto">
            Partner with us and get your brand in front of our audience. Select the package that fits your organization.
          </p>
        </div>

        {/* Tier cards */}
        <div
          className={
            tiers.length === 1
              ? "max-w-sm mx-auto"
              : tiers.length === 2
              ? "grid grid-cols-1 gap-6 md:grid-cols-2 max-w-3xl mx-auto"
              : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {tiers.map((tier, i) => (
            <DeckTierCard
              key={tier.id}
              tier={tier}
              primaryColor={primaryColor}
              slug={slug}
              featured={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
