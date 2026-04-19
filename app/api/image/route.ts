import { head } from "@vercel/blob";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing url parameter", { status: 400 });
  }

  // Only allow proxying Vercel Blob URLs
  if (!url.includes("vercel-storage.com") && !url.includes("public.blob.vercel-storage.com")) {
    return new Response("Invalid URL", { status: 400 });
  }

  try {
    // Fetch the private blob server-side (token is in env)
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!res.ok) {
      return new Response("Image not found", { status: 404 });
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const body = res.body;

    if (!body) {
      return new Response("Empty response", { status: 502 });
    }

    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Failed to fetch image", { status: 502 });
  }
}
