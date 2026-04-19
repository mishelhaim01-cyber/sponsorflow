import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const EXTRACTION_PROMPT = `Extract structured data from this sponsorship deck and return ONLY a valid JSON object — no markdown, no explanation.

Return this exact shape:
{
  "name": "event or campaign name",
  "eventDate": "YYYY-MM-DD or null",
  "venue": "venue or location or null",
  "ticketUrl": "ticket purchase URL if mentioned or null",
  "ticketButtonText": "ticket button label if mentioned or null",
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
- sections: extract any descriptive blocks — About Us, Our Audience, Why Sponsor, Past Sponsors, Our Reach, etc.
- tiers: extract sponsorship packages. price must be a number (no currency symbols). If slots not mentioned, use 1.
- If a field is not found, use null.
- Return ONLY the JSON object, nothing else.`;

function parseJson(text: string) {
  const jsonText = text
    .replace(/^```json\s*/m, "")
    .replace(/^```\s*/m, "")
    .replace(/\s*```$/m, "")
    .trim();
  return JSON.parse(jsonText);
}

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

  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return new Response("Google AI API key not configured", { status: 500 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Try text extraction first
  let pdfText = "";
  try {
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    pdfText = data.text ?? "";
  } catch {
    // ignore — will fall back to vision
  }

  try {
    let result;

    if (pdfText.trim().length >= 30) {
      // Text-based PDF — send extracted text
      result = await model.generateContent(
        `${EXTRACTION_PROMPT}\n\nDeck text:\n${pdfText.slice(0, 12000)}`
      );
    } else {
      // Image-based PDF (Canva, InDesign, etc.) — send as document for vision
      result = await model.generateContent([
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64,
          },
        } as any,
        EXTRACTION_PROMPT,
      ]);
    }

    const text = result.response.text();
    const extracted = parseJson(text);
    return Response.json(extracted);
  } catch (err: any) {
    return new Response(
      `Import failed: ${err?.message ?? "AI could not read the deck"}`,
      { status: 500 }
    );
  }
}
