"use client";

import { useRef, useState } from "react";

type Props = {
  name: string;
  currentUrl?: string | null;
  label?: string;
  hint?: string;
};

export function ImageUpload({
  name,
  currentUrl,
  label = "Image",
  hint,
}: Props) {
  const [url, setUrl] = useState(currentUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || "Upload failed");
        return;
      }

      const { url: uploadedUrl } = await res.json();
      setUrl(uploadedUrl);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Hidden input carries the URL value to the form */}
      <input type="hidden" name={name} value={url} />

      {/* Preview */}
      {url && (
        <div className="mb-3 relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Remove
          </button>
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-center hover:border-gray-400 transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <span className="text-sm text-gray-500">Uploading…</span>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700">
              {url ? "Replace image" : "Click to upload"}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              JPG, PNG, WebP — max 5MB
            </p>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}

      {hint && !error && (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      )}
    </div>
  );
}
