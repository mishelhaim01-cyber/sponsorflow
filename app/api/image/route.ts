import { getDownloadUrl } from "@vercel/blob";
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

  try {
    // Generate a short-lived signed download URL and redirect to it
    const downloadUrl = await getDownloadUrl(url, { token });

    return Response.redirect(downloadUrl, 302);
  } catch (err: any) {
    return new Response(`Image error: ${err?.message ?? String(err)}`, { status: 502 });
  }
}
