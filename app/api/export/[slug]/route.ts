import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { prisma } from "@/lib/prisma";

// Allow up to 60 seconds — PDF generation can take 5–15s on cold starts
export const maxDuration = 60;

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  // ── 1. Data guard ──────────────────────────────────────────────────────────
  // Identical isPublic check to the deck page. Don't spin up Puppeteer for a
  // campaign that wouldn't be accessible on the public deck anyway.
  const campaign = await prisma.campaign.findUnique({
    where: { slug: params.slug, isPublic: true },
    select: { name: true },
  });

  if (!campaign) {
    return new Response("Not found", { status: 404 });
  }

  // ── 2. Build the URL to render ─────────────────────────────────────────────
  // Puppeteer navigates to the live deck with ?print=true, which suppresses the
  // SponsorFlow footer and is otherwise identical to the public page.
  // The deck page enforces all the same data filtering (isPublic, confirmed only,
  // notes never selected) — the PDF output is exactly what a sponsor would see.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const deckUrl = `${appUrl}/deck/${params.slug}?print=true`;

  // ── 3. Launch Puppeteer ────────────────────────────────────────────────────
  // @sparticuz/chromium provides a serverless-compatible Chromium binary that
  // fits within Vercel's function size limits (unlike the full puppeteer bundle).
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();

    // 1280px matches the max-w-4xl deck layout — renders cleanly at A4 width
    await page.setViewport({ width: 1280, height: 900 });

    // networkidle2 waits until there are ≤2 in-flight requests for 500ms.
    // This ensures sponsor logos and hero images finish loading before capture.
    await page.goto(deckUrl, { waitUntil: "networkidle2", timeout: 30_000 });

    const pdf = await page.pdf({
      format: "A4",
      // Required for background colors (tier headers, CTA section) to appear.
      // The @media print CSS in globals.css also sets print-color-adjust: exact
      // as a belt-and-suspenders measure.
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    // ── 4. Stream the PDF back ───────────────────────────────────────────────
    const safeName = campaign.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const filename = `${safeName}-sponsorship-deck.pdf`;

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        // Never cache — the deck data can change at any time
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[export] PDF generation failed:", err);
    return new Response("PDF generation failed", { status: 500 });
  } finally {
    // Always close — don't leave zombie browser processes on errors
    await browser.close();
  }
}
