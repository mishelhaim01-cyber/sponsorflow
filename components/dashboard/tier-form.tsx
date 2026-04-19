"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import type { FormState } from "@/actions/tiers";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500";

export type TierInitialData = {
  name?: string;
  price?: number;
  totalSlots?: number;
  description?: string | null;
  benefits?: string[];
  sortOrder?: number;
};

type Props = {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  initialData?: TierInitialData;
  mode: "create" | "edit";
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function TierForm({
  action,
  initialData,
  mode,
  onSuccess,
  onCancel,
}: Props) {
  const [state, formAction] = useFormState<FormState, FormData>(action, null);
  const [benefits, setBenefits] = useState<string[]>(
    initialData?.benefits?.length ? initialData.benefits : [""]
  );

  // Notify parent (e.g. AddTierSection) so it can close the inline form
  useEffect(() => {
    if (state && "success" in state) {
      onSuccess?.();
    }
  }, [state, onSuccess]);

  function addBenefit() {
    setBenefits((prev) => [...prev, ""]);
  }

  function removeBenefit(index: number) {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  }

  function updateBenefit(index: number, value: string) {
    setBenefits((prev) => prev.map((b, i) => (i === index ? value : b)));
  }

  return (
    <form action={formAction} className="space-y-5">
      {state && "error" in state && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state && "success" in state && mode === "edit" && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Tier saved.
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Tier name
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={initialData?.name ?? ""}
          placeholder="e.g. Platinum, Gold, Presenting"
          className={inputClass}
        />
      </div>

      {/* Price + Capacity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Price (USD)
          </label>
          <input
            name="price"
            type="number"
            required
            min="0"
            step="any"
            defaultValue={initialData?.price ?? ""}
            placeholder="5000"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Capacity
          </label>
          <input
            name="totalSlots"
            type="number"
            required
            min="1"
            step="1"
            defaultValue={initialData?.totalSlots ?? ""}
            placeholder="4"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-400">
            Number of available spots for this tier
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Description{" "}
          <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          name="description"
          rows={2}
          defaultValue={initialData?.description ?? ""}
          placeholder="A short summary of what this tier includes."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
        />
      </div>

      {/* Benefits */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Benefits
        </label>
        <div className="space-y-2">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2">
              {/* All inputs share name="benefits" — formData.getAll("benefits") collects them */}
              <input
                name="benefits"
                type="text"
                value={benefit}
                onChange={(e) => updateBenefit(i, e.target.value)}
                placeholder={`Benefit ${i + 1}`}
                className={inputClass}
              />
              {benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBenefit(i)}
                  className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Remove benefit"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addBenefit}
          className="mt-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          + Add benefit
        </button>
      </div>

      {/* Display order — only relevant when editing */}
      {mode === "edit" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Display order
          </label>
          <input
            name="sortOrder"
            type="number"
            min="0"
            step="1"
            defaultValue={initialData?.sortOrder ?? 0}
            className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <p className="mt-1 text-xs text-gray-400">
            Lower numbers appear first on the deck.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <SubmitButton label={mode === "create" ? "Add tier" : "Save changes"} />
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
