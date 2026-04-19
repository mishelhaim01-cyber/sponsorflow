"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import {
  createSponsorshipSchema,
  updateSponsorshipSchema,
} from "@/lib/validations/sponsorship";

export type FormState = { error: string } | { success: true } | null;

function orNull(value: FormDataEntryValue | null): string | null {
  const str = (value as string | null)?.trim();
  return str || null;
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createSponsorship(
  tierId: string,
  campaignId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireAuth();

  // Single query verifies tier exists AND campaign is owned by this user
  const tier = await prisma.sponsorshipTier.findFirst({
    where: { id: tierId, campaign: { userId } },
    include: { _count: { select: { sponsorships: true } } },
  });
  if (!tier) return { error: "Tier not found." };

  if (tier._count.sponsorships >= tier.totalSlots) {
    return {
      error: `This tier is at full capacity (${tier.totalSlots} spot${tier.totalSlots !== 1 ? "s" : ""}).`,
    };
  }

  const parsed = createSponsorshipSchema.safeParse({
    sponsorName: formData.get("sponsorName"),
    sponsorLogoUrl: orNull(formData.get("sponsorLogoUrl")),
    status: formData.get("status"),
    isPublic: formData.get("isPublic") === "true",
    notes: orNull(formData.get("notes")),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  await prisma.sponsorship.create({
    data: { tierId, ...parsed.data },
  });

  revalidatePath(`/campaigns/${campaignId}/tiers/${tierId}`);
  revalidatePath(`/campaigns/${campaignId}`);

  return { success: true };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateSponsorship(
  sponsorshipId: string,
  tierId: string,
  campaignId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireAuth();

  // Three-level ownership check: sponsorship → tier → campaign → user
  const sponsorship = await prisma.sponsorship.findFirst({
    where: { id: sponsorshipId, tier: { campaign: { userId } } },
  });
  if (!sponsorship) return { error: "Sponsorship not found." };

  const parsed = updateSponsorshipSchema.safeParse({
    sponsorName: orNull(formData.get("sponsorName")) ?? undefined,
    sponsorLogoUrl: orNull(formData.get("sponsorLogoUrl")),
    status: formData.get("status") || undefined,
    isPublic: formData.get("isPublic") === "true",
    notes: orNull(formData.get("notes")),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  await prisma.sponsorship.update({
    where: { id: sponsorshipId },
    data: parsed.data,
  });

  revalidatePath(`/campaigns/${campaignId}/tiers/${tierId}`);
  revalidatePath(`/campaigns/${campaignId}`);

  return { success: true };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteSponsorship(
  sponsorshipId: string,
  tierId: string,
  campaignId: string
): Promise<void> {
  const userId = await requireAuth();

  await prisma.sponsorship.deleteMany({
    where: { id: sponsorshipId, tier: { campaign: { userId } } },
  });

  revalidatePath(`/campaigns/${campaignId}/tiers/${tierId}`);
  revalidatePath(`/campaigns/${campaignId}`);
}
