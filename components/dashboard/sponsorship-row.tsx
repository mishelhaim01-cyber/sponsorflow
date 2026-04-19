"use client";

import { useState, useTransition } from "react";
import { deleteSponsorship } from "@/actions/sponsorships";
import type { FormState } from "@/actions/sponsorships";
import type { SponsorshipRowData } from "@/types";
import { SponsorshipStatusBadge } from "./sponsorship-status-badge";
import { SponsorshipForm } from "./sponsorship-form";

type Props = {
  sponsorship: SponsorshipRowData;
  // Action is bound server-side: updateSponsorship.bind(null, id, tierId, campaignId)
  updateAction: (prevState: FormState, formData: FormData) => Promise<FormState>;
  tierId: string;
  campaignId: string;
};

export function SponsorshipRow({
  sponsorship,
  updateAction,
  tierId,
  campaignId,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [deleting, startDeleting] = useTransition();

  function handleDelete() {
    if (
      !confirm(
        `Remove ${sponsorship.sponsorName}? This cannot be undone.`
      )
    )
      return;
    startDeleting(() =>
      deleteSponsorship(sponsorship.id, tierId, campaignId)
    );
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
        <SponsorshipForm
          action={updateAction}
          initialData={sponsorship}
          mode="edit"
          onSuccess={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
      <SponsorshipStatusBadge status={sponsorship.status} />

      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-900">
          {sponsorship.sponsorName}
        </span>
        {sponsorship.notes && (
          <span
            className="ml-2 text-xs text-gray-400"
            title="Has internal notes"
          >
            ∗
          </span>
        )}
      </div>

      {/* Deck visibility indicator */}
      <span
        className={`shrink-0 text-xs font-medium ${
          sponsorship.isPublic ? "text-gray-500" : "text-gray-300"
        }`}
        title={
          sponsorship.isPublic
            ? "Visible on public deck"
            : "Hidden from public deck"
        }
      >
        {sponsorship.isPublic ? "Public" : "Hidden"}
      </span>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50 transition-colors"
        >
          {deleting ? "…" : "Remove"}
        </button>
      </div>
    </div>
  );
}
