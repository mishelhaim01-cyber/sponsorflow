import type { Campaign, SponsorshipTier, Sponsorship } from "@prisma/client";

// Campaign with its tiers and all sponsorships — used on the dashboard overview
export type CampaignWithTiers = Campaign & {
  tiers: (SponsorshipTier & {
    sponsorships: Sponsorship[];
  })[];
};

// Single tier with its sponsorships — used on the sponsorship management page
export type TierWithSponsorships = SponsorshipTier & {
  sponsorships: Sponsorship[];
};

// Tier with only a sponsorship count — used on the tier list page
export type TierWithCount = SponsorshipTier & {
  _count: { sponsorships: number };
};

// Minimal sponsorship data safe to pass to client components (no Date objects)
export type SponsorshipRowData = {
  id: string;
  sponsorName: string;
  sponsorLogoUrl: string | null;
  status: import("@prisma/client").SponsorshipStatus;
  isPublic: boolean;
  notes: string | null;
};

// Derived availability summary for a tier
export type TierAvailability = {
  tierId: string;
  totalSlots: number;
  filled: number;
  available: number;
};

// Shape of a Server Action response
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
