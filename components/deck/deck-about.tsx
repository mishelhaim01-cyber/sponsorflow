export type DeckSection = {
  title: string;
  content: string;
};

type Props = {
  sections: DeckSection[];
  primaryColor: string;
};

export function DeckAbout({ sections, primaryColor }: Props) {
  if (sections.length === 0) return null;

  return (
    <section className="bg-white divide-y divide-gray-100">
      {sections.map((section, i) => (
        <div
          key={i}
          className="py-16 md:py-20"
        >
          <div className="max-w-5xl mx-auto px-8">
            <div className="flex flex-col md:flex-row gap-8 md:gap-20">
              {/* Left: label + title */}
              <div className="md:w-2/5 md:pt-1">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-px w-8 shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: primaryColor }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 leading-snug md:text-3xl">
                  {section.title}
                </h2>
              </div>

              {/* Right: content */}
              <div className="md:w-3/5">
                <p className="text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
