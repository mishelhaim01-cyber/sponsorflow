import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request): Promise<Response> {
  // Only authenticated users can upload
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return new Response("No file provided", { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return new Response("Only image files are allowed", { status: 400 });
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return new Response("File size must be under 5MB", { status: 400 });
  }

  const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return Response.json({ url: blob.url });
}
