import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { StatusBadge } from "@/components/dashboard/status-badge";

const tabs = [
  { label: "Overview", href: "" },
  { label: "Tiers", href: "/tiers" },
  { label: "Settings", href: "/settings" },
];

export default async function CampaignLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { campaignId: string };
}) {
  const userId = await requireAuth();

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.campaignId, userId },
  });

  if (!campaign) notFound();

  const base = `/campaigns/${campaign.id}`;

  return (
    <div>
      {/* Campaign header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-semibold text-gray-900">{campaign.name}</h1>
          <StatusBadge status={campaign.status} />
        </div>
        {campaign.isPublic && (
          <a
            href={`/deck/${campaign.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors"
          >
            /deck/{campaign.slug} ↗
          </a>
        )}
      </div>

      {/* Tab nav */}
      <nav className="flex gap-1 border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={`${base}${tab.href}`}
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 -mb-px transition-colors"
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
