import { SponsorshipStatus } from "@prisma/client";

const styles: Record<SponsorshipStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  in_conversation: "bg-blue-100 text-blue-700",
  reserved: "bg-amber-100 text-amber-700",
  pending_payment: "bg-orange-100 text-orange-700",
  confirmed: "bg-green-100 text-green-700",
};

const labels: Record<SponsorshipStatus, string> = {
  draft: "Draft",
  in_conversation: "In conversation",
  reserved: "Reserved",
  pending_payment: "Pending payment",
  confirmed: "Confirmed",
};

export function SponsorshipStatusBadge({
  status,
}: {
  status: SponsorshipStatus;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
