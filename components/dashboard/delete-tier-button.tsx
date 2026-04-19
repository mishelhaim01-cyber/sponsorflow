"use client";

import { useTransition } from "react";
import { deleteTier } from "@/actions/tiers";

type Props = {
  tierId: string;
  campaignId: string;
  variant?: "inline" | "danger";
};

export function DeleteTierButton({ tierId, campaignId, variant = "inline" }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this tier? This cannot be undone.")) return;
    startTransition(() => deleteTier(tierId, campaignId));
  }

  if (variant === "danger") {
    return (
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Deleting…" : "Delete tier"}
      </button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isPending ? "…" : "Delete"}
    </button>
  );
}
