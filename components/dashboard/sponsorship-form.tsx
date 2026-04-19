"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { SponsorshipStatus } from "@prisma/client";
import type { FormState } from "@/actions/sponsorships";
import type { SponsorshipRowData } from "@/types";

const STATUS_OPTIONS: { value: SponsorshipStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "in_conversation", label: "In conversation" },
  { value: "reserved", label: "Reserved" },
  { value: "pending_payment", label: "Pending payment" },
  { value: "confirmed", label: "Confirmed" },
];

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500";

type Props = {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  initialData?: Partial<SponsorshipRowData>;
  mode: "create" | "edit";
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function SponsorshipForm({
  action,
  initialData,
  mode,
  onSuccess,
  onCancel,
}: Props) {
  const [state, formAction] = useFormState<FormState, FormData>(action, null);
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? true);

  useEffect(() => {
    if (state && "success" in state) {
      onSuccess?.();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      {state && "error" in state && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Sponsor name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Sponsor name
        </label>
        <input
          name="sponsorName"
          type="text"
          required
          defaultValue={initialData?.sponsorName ?? ""}
          placeholder="Acme Corp"
          className={inputClass}
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Status
        </label>
        <select
          name="status"
          defaultValue={initialData?.status ?? "draft"}
          className={inputClass}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Logo URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Logo URL{" "}
          <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          name="sponsorLogoUrl"
          type="url"
          defaultValue={initialData?.sponsorLogoUrl ?? ""}
          placeholder="https://example.com/logo.png"
          className={inputClass}
        />
      </div>

      {/* Public visibility toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Show on public deck
        </label>
        {/* Hidden input carries the boolean; avoids checkbox on/off FormData quirks */}
        <input type="hidden" name="isPublic" value={isPublic ? "true" : "false"} />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPublic((v) => !v)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
              isPublic ? "bg-gray-900" : "bg-gray-300"
            }`}
            role="switch"
            aria-checked={isPublic}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                isPublic ? "translate-x-4" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-gray-500">
            {isPublic
              ? "Sponsor name and logo visible on deck"
              : "Hidden — internal tracking only"}
          </span>
        </div>
      </div>

      {/* Internal notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Internal notes{" "}
          <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          name="notes"
          rows={2}
          defaultValue={initialData?.notes ?? ""}
          placeholder="Deal contacts, contract details, follow-up dates…"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
        />
        <p className="mt-1 text-xs text-gray-400">
          Never shown on the public deck.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <SubmitButton label={mode === "create" ? "Add sponsorship" : "Save"} />
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
