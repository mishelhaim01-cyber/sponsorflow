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

  // Upload as private — served through /api/image proxy
  const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
    access: "private",
  });

  // Return a proxy URL so the image is publicly accessible via our server
  const proxyUrl = `/api/image?url=${encodeURIComponent(blob.url)}`;

  return Response.json({ url: proxyUrl });
}
