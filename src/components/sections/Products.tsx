"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "../Icons";
import { VARIANTS } from "@/lib/variants";
import { setState, useStore } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/lenis";

gsap.registerPlugin(useGSAP);

export default function Products() {
  const root = useRef<HTMLElement>(null);
  const index = useStore((s) => s.variant);
  const v = VARIANTS[index];

  const select = (i: number) => {
    if (i === index) return;
    setState({ variant: i });
    document.documentElement.style.setProperty("--accent", VARIANTS[i].accent);
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-swap]",
        { yPercent: 40, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out", stagger: 0.05 },
      );
    },
    { scope: root, dependencies: [index], revertOnUpdate: false },
  );

  return (
    <section id="range" data-can="products" ref={root} className="relative z-2 py-28 md:min-h-[100svh] md:py-36">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-x-12 px-4 sm:px-8 md:grid-cols-12">
        <header className="md:col-span-6 md:row-start-1">
          <p className="eyebrow text-fog">(04) The range — {String(index + 1).padStart(2, "0")} / {String(VARIANTS.length).padStart(2, "0")}</p>
          <div className="mt-6 overflow-hidden" aria-live="polite">
            <h2 data-swap className="font-display text-[clamp(3rem,7vw,7.5rem)] uppercase leading-[0.86]">
              <span className="block text-fog">Red Bull</span>
              <span className="block text-accent">{v.name}</span>
            </h2>
          </div>
          <p data-swap className="mt-6 text-xl font-semibold">{v.tagline}</p>
          <p data-swap className="mt-3 max-w-lg text-lg leading-relaxed text-snow/75">{v.description}</p>
          <dl data-swap className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {[
              ["Volume", "250 ml"],
              ["Caffeine", "80 mg / can"],
              ["Flavour", v.flavor ? v.flavor.toLowerCase() : "original"],
            ].map(([k, val]) => (
              <div key={k}>
                <dt className="eyebrow text-fog">{k}</dt>
                <dd className="mt-1 font-display text-3xl capitalize">{val}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* On phones the 3D can tracks this slot; on desktop it floats in the right column. */}
        <div data-can-mobile="products" aria-hidden className="h-[64svh] md:col-span-6 md:col-start-7 md:row-span-2 md:row-start-1 md:h-auto" />

        <div className="mt-2 md:col-span-6 md:row-start-2 md:mt-14">
          <p className="eyebrow mb-3 text-fog">Choose an edition — the can updates in 3D</p>
          <ul className="border-t border-line">
            {VARIANTS.map((item, i) => {
              const active = i === index;
              return (
                <li key={item.id} className="border-b border-line">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => select(i)}
                    className={`group flex min-h-16 w-full cursor-pointer items-center gap-5 py-3 text-left transition-colors duration-300 ${
                      active ? "text-snow" : "text-snow/55 hover:text-snow"
                    }`}
                  >
                    <span className="eyebrow w-6 text-fog">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className="size-3.5 shrink-0 rounded-full ring-2 ring-white/15 transition-transform duration-300 group-hover:scale-125"
                      style={{ background: item.tile }}
                    />
                    <span className="flex-1 font-display text-[1.9rem] uppercase leading-none tracking-wide">{item.name}</span>
                    <span className="hidden text-sm text-fog sm:inline">{item.tagline}</span>
                    <ArrowUpRight
                      className={`size-5 shrink-0 transition-all duration-300 ${
                        active ? "rotate-45 text-accent" : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
