"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  sponsorName: z.string().min(1, "Name is required").max(100),
  sponsorEmail: z.string().email("Valid email required"),
  sponsorCompany: z.string().max(100).optional(),
});

export type InterestState =
  | { success: true }
  | { error: string }
  | null;

export async function expressInterest(
  tierId: string,
  slug: string,
  _prevState: InterestState,
  formData: FormData
): Promise<InterestState> {
  // Verify the tier belongs to a public campaign
  const tier = await prisma.sponsorshipTier.findFirst({
    where: { id: tierId, campaign: { isPublic: true } },
    include: {
      _count: { select: { sponsorships: { where: { status: "confirmed" } } } },
    },
  });

  if (!tier) return { error: "This sponsorship tier is no longer available." };

  if (tier._count.sponsorships >= tier.totalSlots) {
    return { error: "Sorry, all spots for this tier are filled." };
  }

  const parsed = schema.safeParse({
    sponsorName: formData.get("sponsorName"),
    sponsorEmail: formData.get("sponsorEmail"),
    sponsorCompany: (formData.get("sponsorCompany") as string) || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  await prisma.sponsorship.create({
    data: {
      tierId,
      sponsorName: parsed.data.sponsorName,
      sponsorEmail: parsed.data.sponsorEmail,
      sponsorCompany: parsed.data.sponsorCompany ?? null,
      status: "in_conversation",
      isPublic: false, // Hidden until campaign owner confirms
    },
  });

  revalidatePath(`/deck/${slug}`);

  return { success: true };
}
