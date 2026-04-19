function formatEventDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

type Props = {
  name: string;
  eventDate: Date | null;
  heroImageUrl: string | null;
  primaryColor: string;
  venue?: string | null;
  ticketUrl?: string | null;
  ticketButtonText?: string | null;
};

function TicketButton({ url, label }: { url: string; label: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-md hover:bg-gray-100 transition-colors"
    >
      🎟 {label}
    </a>
  );
}

export function DeckHero({
  name,
  eventDate,
  heroImageUrl,
  primaryColor,
  venue,
  ticketUrl,
  ticketButtonText,
}: Props) {
  const buttonLabel = ticketButtonText?.trim() || "Buy Tickets";

  if (heroImageUrl) {
    return (
      <div
        className="relative flex min-h-[480px] items-end lg:min-h-[580px]"
        style={{
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 pb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
            Sponsorship Opportunities
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-white lg:text-6xl leading-tight">
            {name}
          </h1>
          {eventDate && (
            <p className="mt-4 text-lg text-white/70 font-medium">{formatEventDate(eventDate)}</p>
          )}
          {venue && (
            <p className="mt-1 text-base text-white/60">📍 {venue}</p>
          )}
          {ticketUrl && <TicketButton url={ticketUrl} label={buttonLabel} />}
        </div>
      </div>
    );
  }

  // No hero image — solid color with gradient overlay for depth
  return (
    <div
      className="relative flex min-h-[380px] items-end lg:min-h-[440px] overflow-hidden"
      style={{ backgroundColor: primaryColor }}
    >
      {/* Subtle radial highlight for depth */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)",
        }}
      />
      {/* Bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-8 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
          Sponsorship Opportunities
        </p>
        <h1 className="text-5xl font-bold tracking-tight text-white lg:text-6xl leading-tight">
          {name}
        </h1>
        {eventDate && (
          <p className="mt-4 text-lg text-white/70 font-medium">{formatEventDate(eventDate)}</p>
        )}
        {venue && (
          <p className="mt-1 text-base text-white/60">📍 {venue}</p>
        )}
        {ticketUrl && <TicketButton url={ticketUrl} label={buttonLabel} />}
      </div>
    </div>
  );
}
