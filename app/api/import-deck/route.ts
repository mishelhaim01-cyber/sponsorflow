import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: NextRequest): Promise<Response> {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || file.type !== "application/pdf") {
    return new Response("PDF file required", { status: 400 });
  }

  if (file.size > 20 * 1024 * 1024) {
    return new Response("File must be under 20MB", { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: base64,
            },
          } as any,
          {
            type: "text",
            text: `Extract structured data from this sponsorship deck and return ONLY a valid JSON object — no markdown, no explanation.

Return this exact shape:
{
  "name": "event or campaign name",
  "eventDate": "YYYY-MM-DD or null",
  "venue": "venue or location or null",
  "ticketUrl": "ticket purchase URL if mentioned or null",
  "ticketButtonText": "ticket button label if mentioned (e.g. 'Buy Tickets') or null",
  "ctaText": "call-to-action text or null",
  "sections": [
    { "title": "section heading", "content": "section body text" }
  ],
  "tiers": [
    {
      "name": "tier name",
      "price": 0,
      "totalSlots": 1,
      "description": "short description or null",
      "benefits": ["benefit 1", "benefit 2"]
    }
  ]
}

Rules:
- sections: extract any descriptive blocks — About Us, Our Audience, Why Sponsor Us, Past Sponsors, Our Reach, etc.
- tiers: extract sponsorship packages with pricing. price must be a number (no currency symbols). If slots not mentioned, use 1.
- If a field is not found in the document, use null (not an empty string).
- Return ONLY the JSON object.`,
          },
        ],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return new Response("Unexpected AI response", { status: 500 });
  }

  try {
    const jsonText = content.text
      .replace(/^```json\s*/m, "")
      .replace(/^```\s*/m, "")
      .replace(/\s*```$/m, "")
      .trim();
    const extracted = JSON.parse(jsonText);
    return Response.json(extracted);
  } catch {
    return new Response("Could not parse AI response", { status: 500 });
  }
}
