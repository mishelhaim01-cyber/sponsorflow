import { CampaignStatus } from "@prisma/client";

const styles: Record<CampaignStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  active: "bg-green-100 text-green-700",
  archived: "bg-yellow-100 text-yellow-700",
};

const labels: Record<CampaignStatus, string> = {
  draft: "Draft",
  active: "Active",
  archived: "Archived",
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
