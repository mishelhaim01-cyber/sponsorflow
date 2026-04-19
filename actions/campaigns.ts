"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import {
  createCampaignSchema,
  updateCampaignSchema,
} from "@/lib/validations/campaign";

export type FormState = { error: string } | { success: true } | null;

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createCampaign(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireAuth();

  const parsed = createCampaignSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    eventDate: (formData.get("eventDate") as string) || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { name, slug, eventDate } = parsed.data;

  const slugTaken = await prisma.campaign.findUnique({ where: { slug } });
  if (slugTaken) {
    return { error: "This URL slug is already taken. Please choose another." };
  }

  const campaign = await prisma.campaign.create({
    data: {
      userId,
      name,
      slug,
      eventDate: eventDate ? new Date(eventDate) : null,
    },
  });

  redirect(`/campaigns/${campaign.id}`);
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateCampaign(
  campaignId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireAuth();

  const existing = await prisma.campaign.findUnique({
    where: { id: campaignId, userId },
  });
  if (!existing) return { error: "Campaign not found." };

  // Parse multiple emails — filter out empty strings
  const ctaEmails = (formData.getAll("ctaEmail") as string[]).filter(
    (e) => e.trim().length > 0
  );

  // Parse dynamic sections — zip title[] + content[] arrays
  const sectionTitles = formData.getAll("sectionTitle") as string[];
  const sectionContents = formData.getAll("sectionContent") as string[];
  const sections = sectionTitles
    .map((title, i) => ({ title: title.trim(), content: (sectionContents[i] ?? "").trim() }))
    .filter((s) => s.title.length > 0);

  const parsed = updateCampaignSchema.safeParse({
    name: (formData.get("name") as string) || undefined,
    eventDate: (formData.get("eventDate") as string) || null,
    ctaText: (formData.get("ctaText") as string) || null,
    heroImageUrl: (formData.get("heroImageUrl") as string) || null,
    primaryColor: (formData.get("primaryColor") as string) || null,
    secondaryColor: (formData.get("secondaryColor") as string) || null,
    isPublic: formData.get("isPublic") === "true",
    status: (formData.get("status") as string) || undefined,
    venue: (formData.get("venue") as string) || null,
    ticketUrl: (formData.get("ticketUrl") as string) || null,
    ticketButtonText: (formData.get("ticketButtonText") as string) || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  // Update campaign fields
  await prisma.campaign.update({
    where: { id: campaignId, userId },
    data: {
      ...parsed.data,
      ctaEmails,
      eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
    },
  });

  // Replace all sections: delete existing, create new ones
  await prisma.campaignSection.deleteMany({ where: { campaignId } });
  if (sections.length > 0) {
    await prisma.campaignSection.createMany({
      data: sections.map((s, i) => ({
        campaignId,
        title: s.title,
        content: s.content,
        sortOrder: i,
      })),
    });
  }

  revalidatePath(`/campaigns`);
  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/settings`);
  revalidatePath(`/deck/${existing.slug}`);

  return { success: true };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteCampaign(campaignId: string): Promise<void> {
  const userId = await requireAuth();

  await prisma.campaign.delete({
    where: { id: campaignId, userId },
  });

  redirect("/campaigns");
}
