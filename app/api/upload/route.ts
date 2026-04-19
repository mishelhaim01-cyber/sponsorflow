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

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return new Response("Storage not configured", { status: 500 });
  }

  try {
    const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
      access: "private",
      token,
    });

    // Return a proxy URL — the proxy fetches the private blob server-side
    const proxyUrl = `/api/image?url=${encodeURIComponent(blob.url)}`;
    return Response.json({ url: proxyUrl });
  } catch (err: any) {
    return new Response(`Upload error: ${err?.message ?? String(err)}`, { status: 500 });
  }
}
