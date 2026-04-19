import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

function InfoRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

export default async function CampaignOverviewPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const userId = await requireAuth();

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.campaignId, userId },
    include: { tiers: { include: { sponsorships: true } } },
  });

  if (!campaign) notFound();

  const totalSlots = campaign.tiers.reduce((sum, t) => sum + t.totalSlots, 0);
  const filled = campaign.tiers.reduce(
    (sum, t) => sum + t.sponsorships.length,
    0
  );
  const confirmed = campaign.tiers.reduce(
    (sum, t) =>
      sum + t.sponsorships.filter((s) => s.status === "confirmed").length,
    0
  );

  const eventDateLabel = campaign.eventDate
    ? new Date(campaign.eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const hasContent =
    campaign.organizationOverview ||
    campaign.audienceSummary ||
    campaign.campaignGoals;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tiers", value: campaign.tiers.length },
          { label: "Slots filled", value: `${filled} / ${totalSlots}` },
          { label: "Confirmed", value: confirmed },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Deck content preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Deck content</h2>
          <Link
            href={`/campaigns/${campaign.id}/settings`}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            Edit →
          </Link>
        </div>

        {hasContent ? (
          <dl className="space-y-4">
            <InfoRow
              label="Organization overview"
              value={campaign.organizationOverview}
            />
            <InfoRow label="Audience" value={campaign.audienceSummary} />
            <InfoRow label="Goals" value={campaign.campaignGoals} />
            {eventDateLabel && (
              <InfoRow label="Event date" value={eventDateLabel} />
            )}
            {campaign.ctaEmail && (
              <InfoRow label="Contact" value={campaign.ctaEmail} />
            )}
          </dl>
        ) : (
          <p className="text-sm text-gray-400">
            No deck content yet.{" "}
            <Link
              href={`/campaigns/${campaign.id}/settings`}
              className="underline hover:text-gray-700"
            >
              Add it in Settings
            </Link>
            .
          </p>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          href={`/campaigns/${campaign.id}/tiers`}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Manage tiers →
        </Link>
        {campaign.isPublic && (
          <a
            href={`/deck/${campaign.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View live deck ↗
          </a>
        )}
        {campaign.isPublic && (
          <a
            href={`/api/export/${campaign.slug}`}
            download
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Export PDF ↓
          </a>
        )}
      </div>
    </div>
  );
}
