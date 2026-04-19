import { z } from "zod";
import { SponsorshipStatus } from "@prisma/client";

export const createSponsorshipSchema = z.object({
  sponsorName: z.string().min(1, "Sponsor name is required").max(100),
  // Empty string is converted to null in the action before Zod sees it
  sponsorLogoUrl: z.string().url("Must be a valid URL").nullable().optional(),
  status: z.nativeEnum(SponsorshipStatus).default(SponsorshipStatus.draft),
  isPublic: z.boolean().default(true),
  // null when cleared, never exposed on the public deck
  notes: z.string().max(1000).nullable().optional(),
});

export const updateSponsorshipSchema = createSponsorshipSchema.partial();

export type CreateSponsorshipInput = z.infer<typeof createSponsorshipSchema>;
export type UpdateSponsorshipInput = z.infer<typeof updateSponsorshipSchema>;
