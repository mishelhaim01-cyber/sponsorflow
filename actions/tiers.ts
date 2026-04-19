"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createTierSchema, updateTierSchema } from "@/lib/validations/tier";

export type FormState = { error: string } | { success: true } | null;

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createTier(
  campaignId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireAuth();

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId, userId },
  });
  if (!campaign) return { error: "Campaign not found." };

  // Auto-assign sortOrder so new tiers append to the end
  const existingCount = await prisma.sponsorshipTier.count({
    where: { campaignId },
  });

  const parsed = createTierSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    totalSlots: formData.get("totalSlots"),
    description: (formData.get("description") as string) || null,
    benefits: formData
      .getAll("benefits")
      .map((b) => b.toString().trim())
      .filter(Boolean),
    sortOrder: existingCount,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  await prisma.sponsorshipTier.create({
    data: { campaignId, ...parsed.data },
  });

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/tiers`);

  return { success: true };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateTier(
  tierId: string,
  campaignId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireAuth();

  // Verify the tier belongs to a campaign owned by this user
  const tier = await prisma.sponsorshipTier.findFirst({
    where: { id: tierId, campaign: { userId } },
  });
  if (!tier) return { error: "Tier not found." };

  const parsed = updateTierSchema.safeParse({
    name: (formData.get("name") as string) || undefined,
    price: formData.get("price") || undefined,
    totalSlots: formData.get("totalSlots") || undefined,
    description: (formData.get("description") as string) || null,
    benefits: formData
      .getAll("benefits")
      .map((b) => b.toString().trim())
      .filter(Boolean),
    sortOrder: formData.get("sortOrder") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  await prisma.sponsorshipTier.update({
    where: { id: tierId },
    data: parsed.data,
  });

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/tiers`);
  revalidatePath(`/campaigns/${campaignId}/tiers/${tierId}`);

  return { success: true };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteTier(
  tierId: string,
  campaignId: string
): Promise<void> {
  const userId = await requireAuth();

  // deleteMany with nested campaign.userId check — atomic ownership + delete
  await prisma.sponsorshipTier.deleteMany({
    where: { id: tierId, campaign: { userId } },
  });

  redirect(`/campaigns/${campaignId}/tiers`);
}
