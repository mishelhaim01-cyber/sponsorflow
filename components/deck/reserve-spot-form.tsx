"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { expressInterest, type InterestState } from "@/actions/express-interest";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
      style={{ backgroundColor: "var(--primary-color)" }}
    >
      {pending ? "Submitting…" : "Submit interest"}
    </button>
  );
}

type Props = {
  tierId: string;
  tierName: string;
  slug: string;
  primaryColor: string;
  isFull: boolean;
};

export function ReserveSpotForm({ tierId, tierName, slug, primaryColor, isFull }: Props) {
  const [open, setOpen] = useState(false);

  const action = expressInterest.bind(null, tierId, slug);
  const [state, formAction] = useFormState<InterestState, FormData>(action, null);

  // Close modal on success after a short delay
  useEffect(() => {
    if (state && "success" in state) {
      const t = setTimeout(() => setOpen(false), 2000);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isFull}
        className="mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: primaryColor }}
      >
        {isFull ? "Sold out" : "Reserve this spot →"}
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5">
              <h3 className="text-base font-semibold text-gray-900">
                Reserve — {tierName}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Fill in your details and we'll be in touch to confirm your spot.
              </p>
            </div>

            {state && "success" in state ? (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                ✓ Request received! We'll be in touch shortly.
              </div>
            ) : (
              <form
                action={formAction}
                className="space-y-4"
                style={{ "--primary-color": primaryColor } as React.CSSProperties}
              >
                {state && "error" in state && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {state.error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="sponsorName"
                    type="text"
                    required
                    placeholder="Jane Smith"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="sponsorEmail"
                    type="email"
                    required
                    placeholder="jane@company.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    name="sponsorCompany"
                    type="text"
                    placeholder="Acme Corp"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>

                <SubmitButton />
              </form>
            )}

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
