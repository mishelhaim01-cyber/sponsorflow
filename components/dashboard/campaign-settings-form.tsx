"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { updateCampaign, type FormState } from "@/actions/campaigns";
import { ImageUpload } from "./image-upload";

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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const inputClass = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500";
const textareaClass = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none";

type DeckSection = { title: string; content: string };

type Props = {
  campaign: any;
  sections: DeckSection[];
  updateAction: (prevState: FormState, formData: FormData) => Promise<FormState>;
};

export function CampaignSettingsForm({ campaign, sections: initialSections, updateAction }: Props) {
  const [state, formAction] = useFormState<FormState, FormData>(updateAction, null);
  const [isPublic, setIsPublic] = useState(campaign.isPublic);
  const [emails, setEmails] = useState<string[]>(
    campaign.ctaEmails?.length > 0 ? campaign.ctaEmails : [""]
  );
  const [sections, setSections] = useState<DeckSection[]>(
    initialSections.length > 0 ? initialSections : []
  );

  // Controlled state for fields that can be overridden by PDF import
  const [name, setName] = useState(campaign.name ?? "");
  const [tagline, setTagline] = useState(campaign.tagline ?? "");
  const [venue, setVenue] = useState(campaign.venue ?? "");
  const [ticketUrl, setTicketUrl] = useState(campaign.ticketUrl ?? "");
  const [ticketButtonText, setTicketButtonText] = useState(campaign.ticketButtonText ?? "");
  const [ctaText, setCtaText] = useState(campaign.ctaText ?? "");
  const [eventDateValue, setEventDateValue] = useState(
    campaign.eventDate ? new Date(campaign.eventDate).toISOString().split("T")[0] : ""
  );
  function addEmail() {
    setEmails((prev) => [...prev, ""]);
  }

  function removeEmail(i: number) {
    setEmails((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateEmail(i: number, value: string) {
    setEmails((prev) => prev.map((e, idx) => (idx === i ? value : e)));
  }

  function addSection() {
    setSections((prev) => [...prev, { title: "", content: "" }]);
  }

  function removeSection(i: number) {
    setSections((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateSection(i: number, field: "title" | "content", value: string) {
    setSections((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s))
    );
  }

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={campaign.status} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── Event Information ──────────────────────── */}
      <section>
        <SectionHeader title="Event information" description="Details shown in the hero banner of your public deck." />
        <div className="space-y-4">
          <Field label="Event date" hint="Shown prominently on the deck.">
            <input
              name="eventDate"
              type="date"
              value={eventDateValue}
              onChange={(e) => setEventDateValue(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Venue / Location" hint="e.g. Rogers Centre, Toronto, ON">
            <input
              name="venue"
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Rogers Centre, Toronto, ON"
              className={inputClass}
            />
          </Field>

          <div className="rounded-lg border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ticket link</p>
            <Field label="Ticket URL" hint="Link to your ticketing platform (Eventbrite, Ticketmaster, etc.)">
              <input
                name="ticketUrl"
                type="url"
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                placeholder="https://eventbrite.com/e/your-event"
                className={inputClass}
              />
            </Field>
            <Field label="Button label" hint='What the button says — e.g. "Buy Tickets", "Get Your Tickets", "Register Now"'>
              <input
                name="ticketButtonText"
                type="text"
                value={ticketButtonText}
                onChange={(e) => setTicketButtonText(e.target.value)}
                placeholder="Buy Tickets"
                className={inputClass}
              />
            </Field>
            {ticketUrl && (
              <p className="text-xs text-gray-400">
                Preview: a white pill button labeled &quot;<strong>{ticketButtonText || "Buy Tickets"}</strong>&quot; will appear in your hero banner, linking to the URL above.
              </p>
            )}
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── Deck Sections ──────────────────────────── */}
      <section>
        <SectionHeader
          title="Deck sections"
          description="Add any sections you want — About us, Why sponsor us, Past sponsors, etc. They appear on the public deck in this order."
        />

        <div className="space-y-4">
          {sections.length === 0 && (
            <p className="text-sm text-gray-400 py-2">
              No sections yet. Add one below.
            </p>
          )}

          {sections.map((section, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Section {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeSection(i)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Section title
                </label>
                <input
                  name="sectionTitle"
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(i, "title", e.target.value)}
                  placeholder="e.g. About us, Why sponsor us, Our reach…"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Content
                </label>
                <textarea
                  name="sectionContent"
                  rows={3}
                  value={section.content}
                  onChange={(e) => updateSection(i, "content", e.target.value)}
                  placeholder="Write the content for this section…"
                  className={textareaClass}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSection}
            className="w-full rounded-lg border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            + Add section
          </button>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── CTA ────────────────────────────────────── */}
      <section>
        <SectionHeader title="Call to action" description="Shown at the bottom of the deck." />
        <div className="space-y-4">
          <Field label="CTA text">
            <input
              name="ctaText"
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Interested in sponsoring? Let's talk."
              className={inputClass}
            />
          </Field>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact emails
            </label>
            <div className="space-y-2">
              {emails.map((email, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    name="ctaEmail"
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(i, e.target.value)}
                    placeholder="name@organization.com"
                    className={inputClass}
                  />
                  {emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmail(i)}
                      className="shrink-0 rounded-md border border-gray-300 px-2.5 text-sm text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addEmail}
              className="mt-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              + Add another email
            </button>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── Visual ─────────────────────────────────── */}
      <section>
        <SectionHeader title="Visual" description="Customize the look of your public deck." />
        <div className="space-y-4">
          <Field label="Tagline" hint="Short subtitle shown below the campaign name in the hero.">
            <input
              name="tagline"
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Toronto's Biggest Annual Music Festival"
              className={inputClass}
            />
          </Field>
          <ImageUpload
            name="logoUrl"
            currentUrl={campaign.logoUrl}
            label="Logo"
            hint="Your organization logo. Shown in the top-left of the hero. Use a PNG with transparent background for best results."
          />
          <ImageUpload
            name="heroImageUrl"
            currentUrl={campaign.heroImageUrl}
            label="Hero image"
            hint="Wide banner photo for the top of your deck. If no photo is set, a gradient using your brand colors is shown instead."
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary color" hint="Main brand color — used for accents, buttons, and the gradient hero.">
              <div className="flex items-center gap-3">
                <input
                  name="primaryColor"
                  type="color"
                  defaultValue={campaign.primaryColor ?? "#111827"}
                  className="h-9 w-14 rounded border border-gray-300 p-0.5 cursor-pointer"
                />
              </div>
            </Field>
            <Field label="Secondary color" hint="Used for accents and highlights throughout the deck.">
              <div className="flex items-center gap-3">
                <input
                  name="secondaryColor"
                  type="color"
                  defaultValue={campaign.secondaryColor ?? "#6366f1"}
                  className="h-9 w-14 rounded border border-gray-300 p-0.5 cursor-pointer"
                />
              </div>
            </Field>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ── Visibility ─────────────────────────────── */}
      <section>
        <SectionHeader title="Visibility" description="Control whether your deck is accessible to the public." />
        <input type="hidden" name="isPublic" value={isPublic ? "true" : "false"} />
        <button
          type="button"
          onClick={() => setIsPublic((v: boolean) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isPublic ? "bg-gray-900" : "bg-gray-300"}`}
          role="switch"
          aria-checked={isPublic}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isPublic ? "translate-x-6" : "translate-x-1"}`} />
        </button>
        <p className="mt-2 text-sm text-gray-500">
          {isPublic ? "Deck is public — anyone with the link can view it." : "Deck is private — only you can see it."}
        </p>
      </section>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
