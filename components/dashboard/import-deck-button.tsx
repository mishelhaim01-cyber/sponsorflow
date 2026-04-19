"use client";

import { useRef, useState } from "react";

type ImportedData = {
  name?: string;
  eventDate?: string | null;
  venue?: string | null;
  ticketUrl?: string | null;
  ticketButtonText?: string | null;
  ctaText?: string | null;
  sections?: { title: string; content: string }[];
  tiers?: {
    name: string;
    price: number;
    totalSlots: number;
    description?: string | null;
    benefits?: string[];
  }[];
};

type Props = {
  onImport: (data: ImportedData) => void;
};

export function ImportDeckButton({ onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/import-deck", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "Import failed");
        return;
      }

      const data: ImportedData = await res.json();
      onImport(data);
    } catch {
      setError("Import failed. Please try again.");
    } finally {
      setLoading(false);
      // Reset so same file can be re-selected
      e.target.value = "";
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Reading PDF…
          </>
        ) : (
          <>
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import from PDF
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFile}
      />

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
