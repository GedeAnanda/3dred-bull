const ITEMS = [
  {
    figure: "100%",
    title: "Wings for Life",
    text: "A not-for-profit foundation funding research to cure spinal cord injury. Red Bull covers its administrative costs, so every donation — and every Wings for Life World Run entry fee — goes to research.",
  },
  {
    figure: "infinity",
    title: "Infinitely recyclable",
    text: "Every Red Bull can is made of aluminium — a material that can be recycled again and again without losing quality.",
  },
  {
    figure: "2007",
    title: "Red Bull Media House",
    text: "Film, TV, print and digital stories from the athletes, artists and adventurers of the Red Bull world.",
  },
];

export default function Purpose() {
  return (
    <section id="purpose" className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <p className="eyebrow text-fog md:col-span-4">(07) Purpose</p>
          <h2 data-reveal className="font-display text-[clamp(2.8rem,6vw,6.4rem)] uppercase leading-[0.9] md:col-span-8">
            Wings for people, <span className="text-outline">not only</span> for athletes.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 border-t border-line md:mt-24 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <article
              key={item.title}
              data-reveal
              className={`group flex flex-col gap-10 border-b border-line py-10 md:border-b-0 md:px-8 md:py-12 ${
                i > 0 ? "md:border-l" : "md:pl-0"
              }`}
            >
              <p className="font-display text-[clamp(4.5rem,8vw,8rem)] leading-[0.8] text-accent transition-transform duration-500 ease-expo group-hover:-translate-y-1">
                {item.figure === "infinity" ? (
                  <>
                    <svg viewBox="0 0 100 50" className="h-[0.72em] w-auto" aria-hidden>
                      <path
                        d="M50 25C38 9 10 7 10 25s28 16 40 0 28-18 40 0-28 16-40 0Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="9"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="sr-only">Infinite</span>
                  </>
                ) : (
                  item.figure
                )}
              </p>
              <div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-snow/75">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
