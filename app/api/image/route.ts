import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing url parameter", { status: 400 });
  }

  // Only allow proxying Vercel Blob URLs
  if (!url.includes("vercel-storage.com")) {
    return new Response("Invalid URL", { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;

  try {
    // Try with Authorization header first
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      // Try with token as query param
      const urlWithToken = token ? `${url}${url.includes("?") ? "&" : "?"}token=${token}` : url;
      const res2 = await fetch(urlWithToken);

      if (!res2.ok) {
        return new Response(`Image not found (${res2.status})`, { status: 404 });
      }

      const contentType = res2.headers.get("content-type") ?? "image/jpeg";
      return new Response(res2.body, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    return new Response(res.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    return new Response(`Failed to fetch image: ${err?.message}`, { status: 502 });
  }
}
