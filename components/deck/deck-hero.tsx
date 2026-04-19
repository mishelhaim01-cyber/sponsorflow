function formatEventDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
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
};

export function DeckHero({ name, eventDate, heroImageUrl, primaryColor }: Props) {
  if (heroImageUrl) {
    return (
      <div
        className="relative flex min-h-[400px] items-end lg:min-h-[500px]"
        style={{
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay so text is always legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 pb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">
            Sponsorship Opportunities
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
            {name}
          </h1>
          {eventDate && (
            <p className="mt-3 text-lg text-white/70">{formatEventDate(eventDate)}</p>
          )}
        </div>
      </div>
    );
  }

  // No hero image — use primaryColor as a solid background
  return (
    <div
      className="flex min-h-[300px] items-end lg:min-h-[360px]"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="w-full max-w-4xl mx-auto px-8 pb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
          Sponsorship Opportunities
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
          {name}
        </h1>
        {eventDate && (
          <p className="mt-3 text-lg text-white/65">{formatEventDate(eventDate)}</p>
        )}
      </div>
    </div>
  );
}
