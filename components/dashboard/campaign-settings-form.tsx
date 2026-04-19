"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import type { Campaign } from "@prisma/client";
import { updateCampaign, type FormState } from "@/actions/campaigns";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500";

const textareaClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none";

type Props = {
  campaign: Campaign;
  updateAction: (prevState: FormState, formData: FormData) => Promise<FormState>;
};

export function CampaignSettingsForm({ campaign, updateAction }: Props) {
  const [state, formAction] = useFormState<FormState, FormData>(updateAction, null);
  const [isPublic, setIsPublic] = useState(campaign.isPublic);

  const eventDateValue = campaign.eventDate
    ? new Date(campaign.eventDate).toISOString().split("T")[0]
    : "";

  return (
    <form action={formAction} className="space-y-10">
      {state && "error" in state && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state && "success" in state && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Changes saved.
        </div>
      )}

      {/* ── Basic Info ─────────────────────────────── */}
      <section>
        <SectionHeader title="Basic info" />
        <div className="space-y-4">
          <Field label="Campaign name">
            <input
              name="name"
              type="text"
              required
              defaultValue={campaign.name}
              className={inputClass}
            />
          </Field>
          <Field label="Event date" hint="Shown on the public deck.">
            <input
              name="eventDate"
              type="date"
              defaultValue={eventDateValue}
              className={inputClass}
            />
          </Field>
          <Field label="Status">
            <select
              name="status"
              defaultValue={campaign.status}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── Deck Content ───────────────────────────── */}
      <section>
        <SectionHeader
          title="Deck content"
          description="This text appears on the public sponsor-facing deck."
        />
        <div className="space-y-4">
          <Field label="Organization overview">
            <textarea
              name="organizationOverview"
              rows={3}
              defaultValue={campaign.organizationOverview ?? ""}
              placeholder="Tell sponsors who you are and what you do."
              className={textareaClass}
            />
          </Field>
          <Field label="Audience summary">
            <textarea
              name="audienceSummary"
              rows={3}
              defaultValue={campaign.audienceSummary ?? ""}
              placeholder="Describe the audience sponsors will reach."
              className={textareaClass}
            />
          </Field>
          <Field label="Campaign goals">
            <textarea
              name="campaignGoals"
              rows={3}
              defaultValue={campaign.campaignGoals ?? ""}
              placeholder="What does this campaign aim to achieve?"
              className={textareaClass}
            />
          </Field>
          <Field label="CTA text" hint="The call-to-action line at the bottom of the deck.">
            <input
              name="ctaText"
              type="text"
              defaultValue={campaign.ctaText ?? ""}
              placeholder="Interested in sponsoring? Let's talk."
              className={inputClass}
            />
          </Field>
          <Field label="Contact email" hint="Sponsors will use this to reach you.">
            <input
              name="ctaEmail"
              type="email"
              defaultValue={campaign.ctaEmail ?? ""}
              placeholder="sponsorships@yourorg.com"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── Visual ─────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Visual"
          description="Customize the look of your public deck."
        />
        <div className="space-y-4">
          <Field
            label="Hero image URL"
            hint="A wide banner image shown at the top of the deck."
          >
            <input
              name="heroImageUrl"
              type="url"
              defaultValue={campaign.heroImageUrl ?? ""}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary color">
              <div className="flex items-center gap-3">
                <input
                  name="primaryColor"
                  type="color"
                  defaultValue={campaign.primaryColor ?? "#111827"}
                  className="h-9 w-14 rounded border border-gray-300 p-0.5 cursor-pointer"
                />
                <span className="text-sm text-gray-500">
                  {campaign.primaryColor ?? "#111827"}
                </span>
              </div>
            </Field>
            <Field label="Secondary color">
              <div className="flex items-center gap-3">
                <input
                  name="secondaryColor"
                  type="color"
                  defaultValue={campaign.secondaryColor ?? "#6366f1"}
                  className="h-9 w-14 rounded border border-gray-300 p-0.5 cursor-pointer"
                />
                <span className="text-sm text-gray-500">
                  {campaign.secondaryColor ?? "#6366f1"}
                </span>
              </div>
            </Field>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── Visibility ─────────────────────────────── */}
      <section>
        <SectionHeader
          title="Visibility"
          description="Control whether your deck is accessible to the public."
        />
        {/* Hidden input carries the real boolean value regardless of checkbox quirks */}
        <input type="hidden" name="isPublic" value={isPublic ? "true" : "false"} />
        <button
          type="button"
          onClick={() => setIsPublic((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            isPublic ? "bg-gray-900" : "bg-gray-300"
          }`}
          role="switch"
          aria-checked={isPublic}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              isPublic ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <p className="mt-2 text-sm text-gray-500">
          {isPublic
            ? "Deck is public — anyone with the link can view it."
            : "Deck is private — only you can see it."}
        </p>
      </section>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
