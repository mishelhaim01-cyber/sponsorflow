import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing url parameter", { status: 400 });
  }

  if (!url.includes("vercel-storage.com")) {
    return new Response("Invalid URL", { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return new Response("Storage not configured", { status: 500 });
  }

  // Try fetching with Authorization header
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const contentType = res.headers.get("content-type") ?? "image/jpeg";
      return new Response(res.body, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "private, max-age=3600",
        },
      });
    }
  } catch {
    // fall through to next attempt
  }

  // Try fetching with token as query param
  try {
    const urlWithToken = `${url}${url.includes("?") ? "&" : "?"}token=${token}`;
    const res = await fetch(urlWithToken);

    if (res.ok) {
      const contentType = res.headers.get("content-type") ?? "image/jpeg";
      return new Response(res.body, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "private, max-age=3600",
        },
      });
    }
  } catch {
    // fall through
  }

  return new Response("Could not load image", { status: 404 });
}
