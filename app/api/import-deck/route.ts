import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

  // Extract text from PDF using pdf-parse
  const buffer = Buffer.from(await file.arrayBuffer());
  let pdfText = "";
  try {
    // Use lib path to avoid Next.js test-file issue
    const pdfParse = require("pdf-parse/lib/pdf-parse.js");
    const data = await pdfParse(buffer);
    pdfText = data.text ?? "";
  } catch {
    return new Response("Could not read PDF — make sure it contains selectable text", { status: 422 });
  }

  if (pdfText.trim().length < 30) {
    return new Response("PDF appears to be image-only. Please use a PDF with selectable text.", { status: 422 });
  }

  // Send extracted text to Gemini
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Extract structured data from this sponsorship deck text and return ONLY a valid JSON object — no markdown, no explanation.

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
- Return ONLY the JSON object, nothing else.

Deck text:
${pdfText.slice(0, 12000)}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonText = text
      .replace(/^```json\s*/m, "")
      .replace(/^```\s*/m, "")
      .replace(/\s*```$/m, "")
      .trim();

    const extracted = JSON.parse(jsonText);
    return Response.json(extracted);
  } catch {
    return new Response("AI could not parse the deck content", { status: 500 });
  }
}
