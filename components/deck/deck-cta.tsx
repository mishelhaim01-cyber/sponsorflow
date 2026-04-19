type Props = {
  ctaText: string | null;
  ctaEmails: string[];
  primaryColor: string;
};

export function DeckCta({ ctaText, ctaEmails, primaryColor }: Props) {
  const emails = ctaEmails.filter(Boolean);

  return (
    <section className="py-20" style={{ backgroundColor: primaryColor }}>
      <div className="max-w-2xl mx-auto px-8 text-center">
        <h2 className="text-2xl font-bold text-white lg:text-3xl leading-snug">
          {ctaText ?? "Interested in sponsoring?"}
        </h2>

        {emails.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors"
              >
                {email}
              </a>
            ))}
          </div>
        )}

        {emails.length > 0 && (
          <p className="mt-4 text-sm text-white/50">
            Click to send us an email
          </p>
        )}
      </div>
    </section>
  );
}
