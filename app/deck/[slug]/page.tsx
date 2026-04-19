import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DeckHero } from "@/components/deck/deck-hero";
import { DeckAbout } from "@/components/deck/deck-about";
import { DeckTiers } from "@/components/deck/deck-tiers";
import { DeckCta } from "@/components/deck/deck-cta";
import type { PublicTierData } from "@/components/deck/deck-tier-card";

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const campaign = await prisma.campaign.findUnique({
    where: { slug: params.slug, isPublic: true },
    select: { name: true, organizationOverview: true },
  });

  if (!campaign) return { title: "Not found" };

  return {
    title: `${campaign.name} — Sponsorship Opportunities`,
    description: campaign.organizationOverview ?? undefined,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PublicDeckPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { print?: string };
}) {
  const isPrint = searchParams.print === "true";
  const campaign = await prisma.campaign.findUnique({
    where: {
      slug: params.slug,
      isPublic: true, // 404 if not published — never leak draft campaign data
    },
    // Using select (not include) so the shape is explicit.
    // Fields NOT selected here cannot appear in the response — this is the
    // primary safety layer preventing internal data from reaching the public.
    select: {
      name: true,
      eventDate: true,
      organizationOverview: true,
      audienceSummary: true,
      campaignGoals: true,
      ctaText: true,
      ctaEmail: true,
      heroImageUrl: true,
      primaryColor: true,
      // userId, status, isPublic, createdAt, updatedAt, templateId — NOT selected
      tiers: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          price: true,
          totalSlots: true,
          description: true,
          benefits: true,
          _count: {
            select: {
              // Count ALL confirmed sponsorships — includes private ones.
              // This gives an accurate remaining count without exposing
              // which sponsors are private.
              sponsorships: { where: { status: "confirmed" } },
            },
          },
          sponsorships: {
            // Only confirmed + explicitly public sponsorships reach the deck.
            // Both conditions are required — a confirmed sponsor who opted out
            // of public visibility is still hidden.
            where: { isPublic: true, status: "confirmed" },
            select: {
              id: true,
              sponsorName: true,
              sponsorLogoUrl: true,
              // notes — deliberately NOT selected; can never leak
              // status — not needed on public deck
              // isPublic — filtered in where clause; no need to expose
            },
          },
        },
      },
    },
  });

  if (!campaign) notFound();

  const primaryColor = campaign.primaryColor ?? "#111827";

  // Serialize tiers: convert Prisma Decimal → string, flatten _count
  const tiers: PublicTierData[] = campaign.tiers.map((tier) => ({
    id: tier.id,
    name: tier.name,
    price: tier.price.toString(),
    totalSlots: tier.totalSlots,
    description: tier.description,
    benefits: tier.benefits,
    confirmedCount: tier._count.sponsorships,
    remaining: tier.totalSlots - tier._count.sponsorships,
    publicSponsors: tier.sponsorships,
  }));

  const hasAbout =
    campaign.organizationOverview ||
    campaign.audienceSummary ||
    campaign.campaignGoals;

  const hasCta = campaign.ctaText || campaign.ctaEmail;

  return (
    <div className="min-h-screen bg-white">
      <DeckHero
        name={campaign.name}
        eventDate={campaign.eventDate}
        heroImageUrl={campaign.heroImageUrl}
        primaryColor={primaryColor}
      />

      {hasAbout && (
        <DeckAbout
          organizationOverview={campaign.organizationOverview}
          audienceSummary={campaign.audienceSummary}
          campaignGoals={campaign.campaignGoals}
        />
      )}

      {tiers.length > 0 && (
        <DeckTiers tiers={tiers} primaryColor={primaryColor} />
      )}

      {hasCta && (
        <DeckCta
          ctaText={campaign.ctaText}
          ctaEmail={campaign.ctaEmail}
          primaryColor={primaryColor}
        />
      )}

      {!isPrint && (
        <footer className="py-10 text-center">
          <p className="text-xs text-gray-300 tracking-wide">
            Powered by SponsorFlow
          </p>
        </footer>
      )}
    </div>
  );
}
