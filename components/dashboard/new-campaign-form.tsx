"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { createCampaign, type FormState } from "@/actions/campaigns";
import { slugify } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Creating…" : "Create campaign"}
    </button>
  );
}

export function NewCampaignForm() {
  const [state, formAction] = useFormState<FormState, FormData>(
    createCampaign,
    null
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  return (
    <form action={formAction} className="space-y-5">
      {state && "error" in state && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Campaign name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Spring Gala 2026"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Public URL slug
        </label>
        <div className="flex items-center rounded-md border border-gray-300 focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500">
          <span className="pl-3 text-sm text-gray-400 shrink-0">
            /deck/
          </span>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="spring-gala-2026"
            className="flex-1 rounded-md px-1 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Auto-generated from name. Cannot be changed after publishing.
        </p>
      </div>

      <div>
        <label
          htmlFor="eventDate"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Event date{" "}
          <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          id="eventDate"
          name="eventDate"
          type="date"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
