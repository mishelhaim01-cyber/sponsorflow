import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request): Promise<Response> {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return new Response("No file provided", { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return new Response("Only image files are allowed", { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return new Response("File size must be under 5MB", { status: 400 });
  }

  try {
    const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return Response.json({ url: blob.url });
  } catch (err: any) {
    // If public access not allowed, fall back to private with proxy
    if (err?.message?.includes("public")) {
      try {
        const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
          access: "private",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        const proxyUrl = `/api/image?url=${encodeURIComponent(blob.url)}`;
        return Response.json({ url: proxyUrl });
      } catch (err2: any) {
        return new Response(`Upload failed: ${err2?.message ?? "unknown error"}`, { status: 500 });
      }
    }
    return new Response(`Upload failed: ${err?.message ?? "unknown error"}`, { status: 500 });
  }
}
