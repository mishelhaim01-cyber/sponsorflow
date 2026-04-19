import { DeckTierCard, type PublicTierData } from "./deck-tier-card";

type Props = {
  tiers: PublicTierData[];
  primaryColor: string;
};

export function DeckTiers({ tiers, primaryColor }: Props) {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Sponsorship Packages
        </h2>
        <p className="text-gray-500 mb-10">
          Partner with us and reach our audience. Choose the package that fits
          your organization.
        </p>

        <div
          className={
            tiers.length === 1
              ? "max-w-md"
              : "grid grid-cols-1 gap-6 md:grid-cols-2"
          }
        >
          {tiers.map((tier) => (
            <DeckTierCard key={tier.id} tier={tier} primaryColor={primaryColor} />
          ))}
        </div>
      </div>
    </section>
  );
}
