type Section = { title: string; content: string };

function AboutBlock({ title, content }: Section) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        {title}
      </h3>
      <p className="text-base text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}

type Props = {
  organizationOverview: string | null;
  audienceSummary: string | null;
  campaignGoals: string | null;
};

export function DeckAbout({
  organizationOverview,
  audienceSummary,
  campaignGoals,
}: Props) {
  const sections: Section[] = [
    organizationOverview && { title: "About us", content: organizationOverview },
    audienceSummary && { title: "Our audience", content: audienceSummary },
    campaignGoals && { title: "Our goals", content: campaignGoals },
  ].filter(Boolean) as Section[];

  if (sections.length === 0) return null;

  const gridClass =
    sections.length === 1
      ? "max-w-2xl"
      : sections.length === 2
        ? "grid gap-12 sm:grid-cols-2"
        : "grid gap-12 md:grid-cols-3";

  return (
    <section className="max-w-4xl mx-auto px-8 py-16 border-b border-gray-100">
      <div className={gridClass}>
        {sections.map((s) => (
          <AboutBlock key={s.title} title={s.title} content={s.content} />
        ))}
      </div>
    </section>
  );
}
