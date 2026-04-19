import Link from "next/link";
import type { Campaign } from "@prisma/client";
import { StatusBadge } from "./status-badge";

function formatDate(date: Date | null): string {
  if (!date) return "No date set";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-gray-900 truncate">
            {campaign.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {formatDate(campaign.eventDate)} · sponsorflow.com/deck/{campaign.slug}
          </p>
        </div>
        <StatusBadge status={campaign.status} />
      </div>

      {campaign.organizationOverview && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {campaign.organizationOverview}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
        <span>{campaign.isPublic ? "Public" : "Private"}</span>
        <span>·</span>
        <span>
          Updated{" "}
          {new Date(campaign.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </Link>
  );
}
