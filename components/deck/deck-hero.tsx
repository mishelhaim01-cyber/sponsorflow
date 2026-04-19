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
  tagline?: string | null;
  logoUrl?: string | null;
  eventDate: Date | null;
  heroImageUrl: string | null;
  primaryColor: string;
  secondaryColor?: string;
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
      className="inline-flex items-center gap-2 mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-md hover:bg-gray-100 hover:scale-[1.02] transition-all"
    >
      🎟 {label}
    </a>
  );
}

export function DeckHero({
  name,
  tagline,
  logoUrl,
  eventDate,
  heroImageUrl,
  primaryColor,
  secondaryColor = "#6366f1",
  venue,
  ticketUrl,
  ticketButtonText,
}: Props) {
  const buttonLabel = ticketButtonText?.trim() || "Buy Tickets";

  const textContent = (dark = false) => (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-8 pb-16 pt-12">
      {/* Logo */}
      {logoUrl && (
        <div className="mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="Logo"
            className="h-14 w-auto object-contain"
            style={{ filter: dark ? "brightness(0) invert(1)" : undefined }}
          />
        </div>
      )}

      <p className="text-xs font-bold uppercase tracking-widest mb-4"
        style={{ color: dark ? "rgba(255,255,255,0.5)" : `${primaryColor}99` }}>
        Sponsorship Opportunities
      </p>

      <h1 className={`text-5xl font-bold tracking-tight leading-tight lg:text-6xl ${dark ? "text-white" : "text-white"}`}>
        {name}
      </h1>

      {tagline && (
        <p className={`mt-4 text-xl font-medium ${dark ? "text-white/70" : "text-white/80"}`}>
          {tagline}
        </p>
      )}

      {(eventDate || venue) && (
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1">
          {eventDate && (
            <p className={`text-base font-medium ${dark ? "text-white/70" : "text-white/80"}`}>
              📅 {formatEventDate(eventDate)}
            </p>
          )}
          {venue && (
            <p className={`text-base ${dark ? "text-white/60" : "text-white/70"}`}>
              📍 {venue}
            </p>
          )}
        </div>
      )}

      {ticketUrl && <TicketButton url={ticketUrl} label={buttonLabel} />}
    </div>
  );

  if (heroImageUrl) {
    return (
      <div
        className="relative flex min-h-[520px] items-end lg:min-h-[600px]"
        style={{
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        {textContent(true)}
      </div>
    );
  }

  // Gradient hero using primary + secondary color
  return (
    <div
      className="relative flex min-h-[440px] items-end lg:min-h-[520px] overflow-hidden"
      style={{ backgroundColor: primaryColor }}
    >
      {/* Mesh overlay for texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 0%, transparent 40%), radial-gradient(circle at 80% 80%, white 0%, transparent 40%)",
        }}
      />
      {/* Bottom fade to darken text area */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {textContent(true)}
    </div>
  );
}
