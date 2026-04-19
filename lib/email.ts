import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SponsorInterestEmailProps = {
  campaignName: string;
  tierName: string;
  tierPrice: string;
  sponsorName: string;
  sponsorEmail: string;
  sponsorCompany?: string | null;
  dashboardUrl: string;
  ownerEmail: string;
};

export async function sendSponsorInterestEmail({
  campaignName,
  tierName,
  tierPrice,
  sponsorName,
  sponsorEmail,
  sponsorCompany,
  dashboardUrl,
  ownerEmail,
}: SponsorInterestEmailProps) {
  if (!process.env.RESEND_API_KEY) return; // Silently skip if not configured

  await resend.emails.send({
    from: "SponsorFlow <notifications@sponsorflow.co>",
    to: ownerEmail,
    subject: `New sponsor interest — ${campaignName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #111;">
        <h2 style="margin: 0 0 8px; font-size: 22px;">New sponsor interest 🎉</h2>
        <p style="margin: 0 0 24px; color: #555; font-size: 15px;">Someone just expressed interest in sponsoring <strong>${campaignName}</strong>.</p>

        <div style="background: #f9f9f9; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #888; width: 130px;">Name</td>
              <td style="padding: 6px 0; font-weight: 600;">${sponsorName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #888;">Email</td>
              <td style="padding: 6px 0;"><a href="mailto:${sponsorEmail}" style="color: #111;">${sponsorEmail}</a></td>
            </tr>
            ${sponsorCompany ? `
            <tr>
              <td style="padding: 6px 0; color: #888;">Company</td>
              <td style="padding: 6px 0;">${sponsorCompany}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 6px 0; color: #888;">Tier</td>
              <td style="padding: 6px 0;">${tierName} — ${tierPrice}</td>
            </tr>
          </table>
        </div>

        <a href="${dashboardUrl}" style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600;">
          View in dashboard →
        </a>

        <p style="margin: 32px 0 0; font-size: 12px; color: #aaa;">SponsorFlow — you're receiving this because you own this campaign.</p>
      </div>
    `,
  });
}
