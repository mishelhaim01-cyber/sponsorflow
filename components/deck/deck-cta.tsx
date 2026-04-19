type Props = {
  ctaText: string | null;
  ctaEmail: string | null;
  primaryColor: string;
};

export function DeckCta({ ctaText, ctaEmail, primaryColor }: Props) {
  return (
    <section className="py-20" style={{ backgroundColor: primaryColor }}>
      <div className="max-w-2xl mx-auto px-8 text-center">
        <h2 className="text-2xl font-bold text-white lg:text-3xl leading-snug">
          {ctaText ?? "Interested in sponsoring?"}
        </h2>

        {ctaEmail && (
          <div className="mt-8">
            <a
              href={`mailto:${ctaEmail}`}
              className="inline-block rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors"
            >
              {ctaEmail}
            </a>
            <p className="mt-3 text-sm text-white/50">
              Click to send us an email
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
