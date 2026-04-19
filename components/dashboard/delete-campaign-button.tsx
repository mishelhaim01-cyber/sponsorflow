"use client";

import { useTransition } from "react";
import { deleteCampaign } from "@/actions/campaigns";

export function DeleteCampaignButton({ campaignId }: { campaignId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    startTransition(() => deleteCampaign(campaignId));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isPending ? "Deleting…" : "Delete campaign"}
    </button>
  );
}
