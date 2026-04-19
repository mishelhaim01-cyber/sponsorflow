import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DeckHero } from "@/components/deck/deck-hero";
import { DeckAbout } from "@/components/deck/deck-about";
import { DeckTiers } from "@/components/deck/deck-tiers";
import { DeckCta } from "@/components/deck/deck-cta";
import type { PublicTierData } from "@/components/deck/deck-tier-card";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const campaign = await prisma.campaign.findUnique({
    where: { slug: params.slug, isPublic: true },
    select: { name: true, sections: { take: 1, orderBy: { sortOrder: "asc" } } },
  });

  if (!campaign) return { title: "Not found" };

  return {
    title: `${campaign.name} — Sponsorship Opportunities`,
    description: campaign.sections[0]?.content ?? undefined,
  };
}

export default async function PublicDeckPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { print?: string };
}) {
  const isPrint = searchParams.print === "true";
  const campaign = await prisma.campaign.findUnique({
    where: { slug: params.slug, isPublic: true },
    select: {
      name: true,
      eventDate: true,
      venue: true,
      ticketUrl: true,
      ticketButtonText: true,
      ctaText: true,
      ctaEmails: true,
      heroImageUrl: true,
      primaryColor: true,
      sections: {
        orderBy: { sortOrder: "asc" },
        select: { title: true, content: true },
      },
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
              sponsorships: { where: { status: "confirmed" } },
            },
          },
          sponsorships: {
            where: { isPublic: true, status: "confirmed" },
            select: {
              id: true,
              sponsorName: true,
              sponsorLogoUrl: true,
            },
          },
        },
      },
    },
  });

  if (!campaign) notFound();

  const primaryColor = campaign.primaryColor ?? "#111827";

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

  const hasCta = campaign.ctaText || campaign.ctaEmails.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <DeckHero
        name={campaign.name}
        eventDate={campaign.eventDate}
        heroImageUrl={campaign.heroImageUrl}
        primaryColor={primaryColor}
        venue={campaign.venue}
        ticketUrl={campaign.ticketUrl}
        ticketButtonText={campaign.ticketButtonText}
      />

      {campaign.sections.length > 0 && (
        <DeckAbout sections={campaign.sections} />
      )}

      {tiers.length > 0 && (
        <DeckTiers tiers={tiers} primaryColor={primaryColor} slug={params.slug} />
      )}

      {hasCta && (
        <DeckCta
          ctaText={campaign.ctaText}
          ctaEmails={campaign.ctaEmails}
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
