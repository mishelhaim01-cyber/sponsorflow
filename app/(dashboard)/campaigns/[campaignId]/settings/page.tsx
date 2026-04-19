import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { updateCampaign } from "@/actions/campaigns";
import { CampaignSettingsForm } from "@/components/dashboard/campaign-settings-form";
import { DeleteCampaignButton } from "@/components/dashboard/delete-campaign-button";

export default async function CampaignSettingsPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const userId = await requireAuth();

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.campaignId, userId },
    include: {
      sections: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!campaign) notFound();

  const updateAction = updateCampaign.bind(null, campaign.id);

  const sections = campaign.sections.map((s) => ({
    title: s.title,
    content: s.content,
  }));

  return (
    <div className="max-w-2xl space-y-12">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <CampaignSettingsForm
          campaign={campaign}
          sections={sections}
          updateAction={updateAction}
        />
      </div>

      {/* Danger zone */}
      <div className="rounded-lg border border-red-200 p-6">
        <h3 className="text-sm font-semibold text-red-700 mb-1">Danger zone</h3>
        <p className="text-sm text-gray-500 mb-4">
          Deleting a campaign is permanent and cannot be undone. All tiers and
          sponsorship records will be removed.
        </p>
        <DeleteCampaignButton campaignId={campaign.id} />
      </div>
    </div>
  );
}
