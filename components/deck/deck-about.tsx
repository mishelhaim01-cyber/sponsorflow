export type DeckSection = {
  title: string;
  content: string;
};

function SectionBlock({ title, content }: DeckSection) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        {title}
      </h3>
      <p className="text-base text-gray-700 leading-relaxed">{content}</p>
    </div>
  );
}

type Props = {
  sections: DeckSection[];
};

export function DeckAbout({ sections }: Props) {
  if (sections.length === 0) return null;

  const gridClass =
    sections.length === 1
      ? "max-w-2xl"
      : sections.length === 2
        ? "grid gap-6 sm:grid-cols-2"
        : "grid gap-6 md:grid-cols-3";

  return (
    <section className="max-w-4xl mx-auto px-8 py-16">
      <div className={gridClass}>
        {sections.map((s, i) => (
          <SectionBlock key={i} title={s.title} content={s.content} />
        ))}
      </div>
    </section>
  );
}
