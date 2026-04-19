import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data;
    const email = email_addresses[0]?.email_address;

    if (!email) return new Response("No email found", { status: 400 });

    await prisma.user.create({
      data: {
        id,
        email,
        name: [first_name, last_name].filter(Boolean).join(" ") || null,
      },
    });
  }

  if (event.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = event.data;
    const email = email_addresses[0]?.email_address;

    await prisma.user.update({
      where: { id },
      data: {
        email: email ?? undefined,
        name: [first_name, last_name].filter(Boolean).join(" ") || null,
      },
    });
  }

  if (event.type === "user.deleted") {
    const { id } = event.data;
    if (id) {
      await prisma.user.delete({ where: { id } });
    }
  }

  return new Response("OK", { status: 200 });
}
