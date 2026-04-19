"use client";

import { useState } from "react";
import type { FormState } from "@/actions/tiers";
import { TierForm } from "./tier-form";

type Props = {
  createAction: (prevState: FormState, formData: FormData) => Promise<FormState>;
};

export function AddTierSection({ createAction }: Props) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 flex items-center gap-1.5 rounded-md border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors w-full justify-center"
      >
        + Add tier
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-5">New tier</h3>
      <TierForm
        action={createAction}
        mode="create"
        // Closing the form unmounts it, resetting all local state cleanly
        onSuccess={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
