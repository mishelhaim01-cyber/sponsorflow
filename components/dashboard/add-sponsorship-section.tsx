"use client";

import { useState } from "react";
import type { FormState } from "@/actions/sponsorships";
import { SponsorshipForm } from "./sponsorship-form";

type Props = {
  createAction: (prevState: FormState, formData: FormData) => Promise<FormState>;
  atCapacity: boolean;
};

export function AddSponsorshipSection({ createAction, atCapacity }: Props) {
  const [open, setOpen] = useState(false);

  if (atCapacity) {
    return (
      <p className="mt-4 text-sm text-gray-400 text-center py-3">
        This tier is at full capacity.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
      >
        + Add sponsorship
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-5">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">
        New sponsorship
      </h4>
      <SponsorshipForm
        action={createAction}
        mode="create"
        onSuccess={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
