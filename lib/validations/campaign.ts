import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens"),
  eventDate: z.string().optional(),
});

export const updateCampaignSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  eventDate: z.string().optional().nullable(),
  ctaText: z.string().max(300).optional().nullable(),
  heroImageUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
    .optional()
    .nullable(),
  secondaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
    .optional()
    .nullable(),
  isPublic: z.boolean().optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
  tagline: z.string().max(200).optional().nullable(),
  logoUrl: z.string().url().optional().nullable().or(z.literal("")),
  venue: z.string().max(200).optional().nullable(),
  ticketUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  ticketButtonText: z.string().max(80).optional().nullable(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
