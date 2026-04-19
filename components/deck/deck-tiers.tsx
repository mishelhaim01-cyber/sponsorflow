import { DeckTierCard, type PublicTierData } from "./deck-tier-card";

type Props = {
  tiers: PublicTierData[];
  primaryColor: string;
  slug: string;
};

export function DeckTiers({ tiers, primaryColor, slug }: Props) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Sponsorship Packages
        </h2>
        <p className="text-gray-500 mb-10 text-base">
          Partner with us and reach our audience. Choose the package that fits your organization.
        </p>

        <div className={tiers.length === 1 ? "max-w-md" : "grid grid-cols-1 gap-6 md:grid-cols-2"}>
          {tiers.map((tier) => (
            <DeckTierCard key={tier.id} tier={tier} primaryColor={primaryColor} slug={slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
