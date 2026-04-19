type Props = {
  ctaText: string | null;
  ctaEmails: string[];
  primaryColor: string;
};

export function DeckCta({ ctaText, ctaEmails, primaryColor }: Props) {
  const emails = ctaEmails.filter(Boolean);

  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: primaryColor }}
    >
      {/* Decorative radial glows for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 15% 50%, rgba(255,255,255,0.5) 0%, transparent 55%), radial-gradient(ellipse at 85% 50%, rgba(255,255,255,0.3) 0%, transparent 55%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-8 text-center">
        {/* Label */}
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-white/40" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            Get In Touch
          </span>
          <div className="h-px w-8 bg-white/40" />
        </div>

        <h2 className="text-4xl font-bold text-white leading-tight md:text-5xl">
          {ctaText ?? "Ready to be part of something big?"}
        </h2>

        {emails.length > 0 && (
          <>
            <p className="mt-6 text-base text-white/60">
              Reach out directly — we'd love to talk.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-gray-900 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-150"
                >
                  <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {email}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
